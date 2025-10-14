import { logger } from './logger';
import * as syntax from './syntax';

export function dumpMessage(message:syntax.Message, str:String="Message")
{
    logger.info(`${str}:\t${Buffer.from(message.serialize()).toString('hex')}`);
}

export function dumpSendingMessage(message:syntax.Message)
{
    dumpMessage(message, "Sending Message");
}

export function dumpReceivingMessage(message:syntax.Message)
{
    dumpMessage(message, "Receiving Message");
}

export function dumpData(data:Buffer)
{
    logger.info(data.toString('hex'));
}