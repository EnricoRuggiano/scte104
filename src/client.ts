import * as net from 'net';
import { Observable, Subject } from 'rxjs';
import * as Protocol from './protocol';
import * as syntax from './syntax';
import { SingleOperationMessage } from './syntax';
import { filter, take } from 'rxjs/operators';
import { logger } from './logger';
import { myBuffer } from './buffer';
import { myDeserializer } from './deserializer';
import sleep  = require("sleep-promise");
import * as Args from './args';
import { program } from './cli';

// Default parameters
let _args = program.parse(process.argv).opts();
const BUFFER_SIZE    = _args.bufferSize ?? process.env.bufferSize ?? 100;
const MESSAGE_NUMBER = _args.messageNumber ?? process.env.messageNumber ?? 100;
const WAIT           = _args.wait ?? process.env.wait ?? 1000;

export class Client 
{
    socket : net.Socket;
    private messageNumber = MESSAGE_NUMBER;

    async connect(host : string, port = 5167) 
    {
        logger.info(`Connecting to ${host}:${port}`)
        this.connected = new Promise((resolve, reject) => 
            (this.resolveConnect = resolve, this.rejectConnect = reject)
        );

        this.socket = net.createConnection({ host, port });
        this.buffer = new myBuffer(BUFFER_SIZE);
        logger.warn(`Client] Buffer size: ${BUFFER_SIZE} bytes. Please consider extend this if you notice any buffer overflow caused by any message`);

        this.socket.addListener('connect', () => this.resolveConnect());
        this.socket.addListener('error', err => this.rejectConnect(err));
        this.socket.addListener('data', data => 
        {
            logger.debug(`CLIENT] Receiving this data in the socket: ${data.toString('hex')}`);
            this.buffer.copy(Uint8Array.from(data))
        });

        this.handle();
        return await this.connected;
    }

    buffer : myBuffer;
    private _messageReceived = new Subject<syntax.SingleOperationMessage>();
    
    private resolveConnect = () => 
    { 
        logger.info("Socket connected");
    };
    
    private rejectConnect = (err? : Error) => 
    {
        logger.error(`Socket error:\t ${err}`);
    };
     
    private connected : Promise<void>;

    private async handle() 
    {
        while (this.socket.readable)
        {
            if (!this.buffer.isEmpty())
            {
                let buffer = this.buffer.toBuffer();
                logger.debug(`Trying to deserialize the buffer got: ${buffer.toString('hex')}`);
                let _message = <syntax.SingleOperationMessage> await myDeserializer.fetch(buffer);
                logger.info(`CLIENT] Message received: ${Buffer.from(_message.serialize()).toString('hex')}`);                
                logger.info(`CLIENT] Message result: ${_message.result.toString()}`)

                // clean the buffer
                this.buffer.clean();
                this._messageReceived.next(_message);
            }
            await sleep(WAIT);
            logger.debug("CLIENT] Waiting to get messages");
        }
    }

    get messageReceived() : Observable<syntax.SingleOperationMessage> 
    {
        return this._messageReceived;
    }

    async disconnect() 
    {
        logger.info("CLIENT] DISCONNECT");
        return new Promise<void>(resolve => this.socket.end(() => resolve()));
    }

    sendMessage(message : syntax.Message) 
    {
        let buffer = message.serialize()
        logger.info(`CLIENT] Message sent: ${Buffer.from(buffer).toString('hex')}`);
        this.socket.write(buffer);
    }

    async request(message : syntax.SingleOperationMessage | syntax.MultipleOperationMessage): Promise<SingleOperationMessage> 
    {
        this.sendMessage(message.with({
            messageNumber: this.messageNumber++,
            asIndex: 1,
        }));
        return await this.messageReceived
            .pipe(filter(x => x.messageNumber === message.messageNumber))
            .pipe(take(1))
            .toPromise()
        ;
    }

    async init(args:Args.Init) 
    {
        return await this.request(
            new syntax.InitRequest().with({
                opID:Protocol.OP.INIT_REQUEST,
                dpiPidIndex:args.dpiPidIndex,
            })
        )
    }

    async alive(args : Args.Alive) 
    {
        return await this.request(
            new syntax.AliveRequest().with({
                time: args.time,
                opID: Protocol.OP.ALIVE_REQUEST,
                dpiPidIndex:args.dpiPidIndex
             })
        )
    }


    async splice(args : Args.Splice) 
    {
        return await this.request(
            new syntax.MultipleOperationMessage().with({
                dpiPidIndex: args.dpiPidIndex,
                timestamp: args.timestamp,
                operations: [
                    new syntax.SpliceRequest().with({
                        opID: Protocol.MOP.SPLICE,
                        ...args
                    })
                ]
            })
        );

    }
}