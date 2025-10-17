import { MessageEvent } from "./message-event"
import * as Protocol from './protocol';
import * as syntax from './syntax';
import { logger } from './logger';

export const ServerDefaultCallback = async (event : MessageEvent) => {
    if (event.message.opID == Protocol.OP.INIT_REQUEST) 
    {
        let msg = event.message as syntax.InitRequest;

        await event.connection.sendMessage(new syntax.InitResponse().with({
            opID: Protocol.OP.INIT_RESPONSE,
            result: Protocol.RESULT.SUCCESS,
            dpiPidIndex:msg.dpiPidIndex,
            messageNumber: msg.messageNumber
        }));
    }
    else if (event.message.opID == Protocol.OP.ALIVE_REQUEST)
    {
        let epoch = new Date('1980-01-06T00:00:00Z').getTime();
        let elapsed = Date.now() - epoch;
        let seconds = elapsed / 1000 | 0;
        let microseconds = (elapsed - seconds*1000) * 1000;

        let msg = event.message as syntax.AliveRequest
        await event.connection.sendMessage(new syntax.AliveResponse().with({
            opID: Protocol.OP.ALIVE_RESPONSE,
            result: Protocol.RESULT.SUCCESS,
            dpiPidIndex:msg.dpiPidIndex,
            messageNumber: msg.messageNumber,
            time: new syntax.Time().with({
                seconds: seconds,
                microseconds: microseconds
            })
        }));
    }
    else if (event.message.opID == Protocol.MULTIPLE_OPERATION_INDICATOR)
    {
        let msg = event.message as syntax.MultipleOperationMessage
        await event.connection.sendMessage(new syntax.InjectCompleteResponse().with({
            opID: Protocol.OP.INJECT_COMPLETE_RESPONSE,
            result: Protocol.RESULT.SUCCESS,
            dpiPidIndex: msg.dpiPidIndex,
            messageNumber: msg.messageNumber
        }));
    }
    else
    {
        logger.debug(event.message);
        await event.connection.sendMessage(new syntax.GeneralResponse().with({
            result: Protocol.RESULT.INVALID_MESSAGE_SYNTAX,
        }));
    }
} 

export const ServerDefaultErrorCallback = (error) => {
    logger.error(`Server error`);
    logger.error(error);
}