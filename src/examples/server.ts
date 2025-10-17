import 'reflect-metadata';
import * as SCTE104 from "../../src";
import process = require('process');
import { Logger, ILogObj  } from "tslog";
import { ServerDefaultCallback, ServerDefaultErrorCallback } from '../server-default-callback';
export const logger:Logger<ILogObj> = new Logger({minLevel: 4});

async function main(argv: string[]) 
{
    SCTE104.program.parse(argv)
    let _args = SCTE104.program.opts();

    let host:string        = _args.host;
    let port:number        = _args.port;

    let server = new SCTE104.Server();
    // server.messageReceived.subscribe(async(event) => 
    // {
    //     if (event.message.opID == SCTE104.OP.INIT_REQUEST) 
    //     {
    //         let msg = event.message as SCTE104.syntax.InitRequest;

    //         await event.connection.sendMessage(new SCTE104.syntax.InitResponse().with({
    //             opID: SCTE104.OP.INIT_RESPONSE,
    //             result: SCTE104.RESULT.SUCCESS,
    //             dpiPidIndex:msg.dpiPidIndex,
    //             messageNumber: msg.messageNumber
    //         }));
    //     }
    //     else if (event.message.opID == SCTE104.OP.ALIVE_REQUEST)
    //     {
    //         let epoch = new Date('1980-01-06T00:00:00Z').getTime();
    //         let elapsed = Date.now() - epoch;
    //         let seconds = elapsed / 1000 | 0;
    //         let microseconds = (elapsed - seconds*1000) * 1000;

    //         let msg = event.message as SCTE104.syntax.AliveRequest
    //         await event.connection.sendMessage(new SCTE104.syntax.AliveResponse().with({
    //             opID: SCTE104.OP.ALIVE_RESPONSE,
    //             result: SCTE104.RESULT.SUCCESS,
    //             dpiPidIndex:msg.dpiPidIndex,
    //             messageNumber: msg.messageNumber,
    //             time: new SCTE104.syntax.Time().with({
    //                 seconds: seconds,
    //                 microseconds: microseconds
    //             })
    //         }));
    //     }
    //     else if (event.message.opID == SCTE104.MULTIPLE_OPERATION_INDICATOR)
    //     {
    //         let msg = event.message as SCTE104.syntax.MultipleOperationMessage
    //         await event.connection.sendMessage(new SCTE104.syntax.InjectCompleteResponse().with({
    //             opID: SCTE104.OP.INJECT_COMPLETE_RESPONSE,
    //             result: SCTE104.RESULT.SUCCESS,
    //             dpiPidIndex: msg.dpiPidIndex,
    //             messageNumber: msg.messageNumber
    //         }));
    //     }
    //     else
    //     {
    //         logger.debug(event.message);
    //         await event.connection.sendMessage(new SCTE104.syntax.GeneralResponse().with({
    //             result: SCTE104.RESULT.INVALID_MESSAGE_SYNTAX,
    //         }));
    //     }
    // }, 


    server.messageReceived.subscribe(ServerDefaultCallback, ServerDefaultErrorCallback);
    // (error) => {
    //     logger.error(`ERROR: ${error}`)
    // });
    server.listen(port=port, host=host);
}

main(process.argv);
