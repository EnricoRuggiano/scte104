import 'reflect-metadata';
import * as SCTE104 from "../../src";
import process = require('process');
import { logger } from "../../src/logger"

const env = process.env;

async function main(argv) 
{
    let port:number        = parseInt(env.port);
    let dpiPidIndex:number = parseInt(env.dpiPidIndex);
    let bind:string        = env.host;

    let server = new SCTE104.Server();
    server.messageReceived.subscribe(async(event) => 
    {
        // For example:    
        if (event.message.opID == SCTE104.OP.INIT_REQUEST) 
        {
            let msg = event.message as SCTE104.elements.InitRequest;

            await event.connection.sendMessage(new SCTE104.elements.InitResponse().with({
                opID: SCTE104.OP.INIT_RESPONSE,
                result: SCTE104.RESULT.SUCCESS,
                dpiPidIndex:msg.dpiPidIndex,
                messageNumber: msg.messageNumber
            }));
        }
        else if (event.message.opID == SCTE104.OP.ALIVE_REQUEST)
        {
            let epoch = new Date('1980-01-06T00:00:00Z').getTime();
            let elapsed = Date.now() - epoch;
            let seconds = elapsed / 1000 | 0;
            let microseconds = (elapsed - seconds*1000) * 1000;

            let msg = event.message as SCTE104.elements.AliveRequest
            await event.connection.sendMessage(new SCTE104.elements.AliveResponse().with({
                opID: SCTE104.OP.ALIVE_RESPONSE,
                result: SCTE104.RESULT.SUCCESS,
                dpiPidIndex:msg.dpiPidIndex,
                messageNumber: msg.messageNumber,
                time: new SCTE104.elements.Time().with({
                    seconds: seconds,
                    microseconds: microseconds
                })
            }));
        }
        else if (event.message.opID == SCTE104.MULTIPLE_OPERATION_INDICATOR)
        {
            let msg = event.message as SCTE104.elements.MultipleOperationMessage
            await event.connection.sendMessage(new SCTE104.elements.InjectCompleteResponse().with({
                opID: SCTE104.OP.INJECT_COMPLETE_RESPONSE,
                result: SCTE104.RESULT.SUCCESS,
                dpiPidIndex: msg.dpiPidIndex,
                messageNumber: msg.messageNumber
            }));
        }
        else
        {
            logger.debug(event.message);
            await event.connection.sendMessage(new SCTE104.elements.GeneralResponse().with({
                result: SCTE104.RESULT.INVALID_MESSAGE_SYNTAX,
            }));
        }
    }, 
    (error) => {
        logger.error(`ERROR: ${error}`)
    });
    server.listen(port=port, bind=bind);
}

main(process.argv.slice(1));
