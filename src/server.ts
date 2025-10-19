import * as net from 'net';
import * as syntax from './syntax';
import { Observable, Subject } from 'rxjs';
import { MessageEvent } from './message-event';
import { myBuffer } from './buffer';
import { myDeserializer } from './deserializer';
import sleep  = require("sleep-promise");
import * as Args from './args';
import { logger } from './logger';

export class Connection 
{
    constructor(
        readonly socket : net.Socket,
        readonly server : Server
    ) 
    {
        logger.debug("SERVER] Handling a new Client connection")
        this.server.connections.push(this);

        // MY BUFFER
        this.buffer = new myBuffer(this.server.bufferSize);
        logger.warn(`SERVER] Buffer size: ${this.server.bufferSize} bytes. Please consider extend this if you notice any buffer overflow caused by any message`);

        this.socket.on('data', (data) => 
        {            
            logger.debug(`SERVER] Receiving this data in the socket: ${data.toString('hex')}`);        
            this.buffer.copy(Uint8Array.from(data))
        });
        this.socket.on('close', () => this.server.connections = this.server.connections.filter(x => x !== this));
        this.handle();
    }

    private buffer : myBuffer;
    
    private _messageReceived = new Subject<syntax.Message>();
    get messageReceived() : Observable<syntax.Message> {
        return this._messageReceived;
    }

    async sendMessage(message : syntax.Message) 
    {
        let buffer = message.serialize()
        logger.info(`SERVER] Message sent: ${Buffer.from(buffer).toString('hex')}`);
        this.socket.write(buffer);
    }

    private async handle() 
    {
        while (true)
        {
            if (!this.buffer.isEmpty())
            {
                let buffer = this.buffer.toBuffer();
                logger.debug(`Trying to deserialize the buffer got: ${buffer.toString('hex')}`);
                let _message = await myDeserializer.fetch(buffer);
                logger.info(`SERVER] Message received: ${Buffer.from(_message.serialize()).toString('hex')}`);

                // clean the buffer
                this.buffer.clean();
                this.onMessageReceived(_message);
            }
            await sleep(this.server.wait);
            logger.debug("SERVER] Waiting to get messages");
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

    public host:string;
    public port:number;
    public logLevel?:string
    public wait?:number;
    public messageNumber?:number
    public bufferSize?:number

    constructor({host, port, logLevel, wait=1000, messageNumber=1, bufferSize=1000}:Args.ConfigArgs)
    {
        Object.assign(this, {host, port, logLevel, wait, messageNumber, bufferSize})
    }

    onMessageReceived(event : MessageEvent) 
    {
        this._messageReceived.next(event);
    }

    get messageReceived() : Observable<MessageEvent> 
    {
        return this._messageReceived;
    }

    async listen(port: number = 5167, host: string = '0.0.0.0') 
    {
        this._server = new net.Server(socket => new Connection(socket, this));
        this._server.listen(port, host);
        logger.info(`Listening at ${host}:${port}`)
    }

    close() 
    {
        if (this._server) 
        {
            logger.info("SERVER] Closing the server")
            this._server.close();
            this._server = null;
        }
    }
}