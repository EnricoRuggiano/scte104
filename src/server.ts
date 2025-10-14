import * as Protocol from './protocol';
import * as net from 'net';
import * as syntax from './syntax';
import { BitstreamReader, BitstreamWriter } from '@astronautlabs/bitstream';
import { Observable, Subject } from 'rxjs';
import { MessageEvent } from './message-event';
import { dumpReceivingMessage, dumpSendingMessage} from './utils';
import { logger } from './logger';
import sleep  = require("sleep-promise");
import { myBuffer } from './buffer';
import { myDeserializer } from './deserializer';

export class Connection 
{
    constructor(
        readonly socket : net.Socket,
        readonly server : Server
    ) 
    {
        logger.debug("Server] Handling a new Client connection")
        this.server.connections.push(this);
        // this.reader = new BitstreamReader();
        // this.writer = new BitstreamWriter(socket);

        // MY BUFFER
        this.buffer = new myBuffer(100);

        this.socket.on('data', (data) => 
        {            
            logger.debug(`SERVER] Receiving this data in the socket: ${data.toString('hex')}`);        
            this.buffer.copy(Uint8Array.from(data))
        });
        this.socket.on('close', () => this.server.connections = this.server.connections.filter(x => x !== this));
        this.handle();
    }

    // private reader : BitstreamReader;
    // private writer : BitstreamWriter;
    private buffer : myBuffer;
    
    private _messageReceived = new Subject<syntax.Message>();
    get messageReceived() : Observable<syntax.Message> {
        return this._messageReceived;
    }

    async sendMessage(message : syntax.Message) 
    {
        dumpSendingMessage(message);
        this.socket.write(message.serialize());
    }

    private async handle() 
    {
        while (true)
        {
            if (!this.buffer.isEmpty())
            {
                try
                {
                    let buffer = this.buffer.toBuffer();

                    logger.debug(`Trying to deserialize the buffer got: ${buffer.toString('hex')}`);
                    let _message = await myDeserializer.fetch(buffer);
                    logger.info(`SERVER] Message received: ${Buffer.from(_message.serialize()).toString('hex')}`);

                    // clean the buffer
                    this.buffer.clean();

                    this.onMessageReceived(_message);
                }
                catch(err)
                {
                    logger.error(err);
                    logger.error("ERROR - Skipping the fetching of the message");
                }
            }
            await sleep(5000);
            logger.info("SERVER] Waiting to get messages");
        }
    }

    private onMessageReceived(message : syntax.Message) 
    {
        this._messageReceived.next(message);
        this.server.onMessageReceived({ connection: this, message });
    }
}

export class Server 
{
    private _server : net.Server;
    private _messageReceived = new Subject<MessageEvent>();

    public connections : Connection[] = [];

    onMessageReceived(event : MessageEvent) 
    {
        this._messageReceived.next(event);
    }

    get messageReceived() : Observable<MessageEvent> 
    {
        return this._messageReceived;
    }

    async listen(port: number = 5167, bind: string = '0.0.0.0') 
    {
        this._server = new net.Server(socket => new Connection(socket, this));
        this._server.listen(port, bind);
    }

    close() 
    {
        if (this._server) 
        {
            logger.info("Server] Closing the server")
            this._server.close();
            this._server = null;
        }
    }
}