import * as Protocol from './protocol';
import * as syntax from './syntax';
import {logger} from './logger';

export class myDeserializer {

    // From a Buffer and an opID get the Message
    static async get (buffer: Buffer, opID):Promise<syntax.Message | null>
    {
        switch(opID)
        {
            case(Protocol.OP.INIT_REQUEST):
                return await syntax.InitRequest.deserialize(buffer);
            case(Protocol.OP.INIT_RESPONSE):
                return await syntax.InitResponse.deserialize(buffer);
            case(Protocol.OP.ALIVE_REQUEST):
                return await syntax.AliveRequest.deserialize(buffer);
            case(Protocol.OP.ALIVE_RESPONSE):
                return await syntax.AliveResponse.deserialize(buffer);
            case(Protocol.OP.INJECT_RESPONSE):
                return await syntax.InjectResponse.deserialize(buffer);
            case(Protocol.OP.INJECT_COMPLETE_RESPONSE):
                return await syntax.InjectCompleteResponse.deserialize(buffer);
            case (Protocol.MULTIPLE_OPERATION_INDICATOR):
                return await syntax.MultipleOperationMessage.deserialize(buffer);
            default:
            {
                let _tmp = await syntax.GeneralResponse.deserialize(buffer)
                if (_tmp.result != Protocol.RESULT.SUCCESS)
                {
                    logger.error(`Detected a message with Result not Success: ${_tmp.result}`);
                    logger.error(`Message: ${buffer}`);
                    logger.error(_tmp);
                    throw new Error(`SCTE104 Message with result NOT SUCCESS`);
                }
                return await syntax.Message.deserialize(buffer);                
            }
        }
    }

    static async fetch(buffer: Buffer): Promise<syntax.Message | null>
    {
        let _msg = await syntax.Message.deserialize(buffer)
        return await this.get(buffer, _msg.opID);
    }
}