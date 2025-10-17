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
    server.messageReceived.subscribe(ServerDefaultCallback, ServerDefaultErrorCallback);
    server.listen(port=port, host=host);
}

main(process.argv);
