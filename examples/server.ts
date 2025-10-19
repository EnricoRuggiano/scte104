import 'reflect-metadata';
import * as SCTE104 from "../src";
import { ServerDefaultCallback, ServerDefaultErrorCallback } from '../src/server-default-callback';
import { program } from '../src/cli/program-general'

async function main(argv: string[]) 
{
    program.parse(argv)
    let _args =program.opts();

    let host:string = _args.host;
    let port:number = _args.port;

    let server = new SCTE104.Server(_args as SCTE104.args.ConfigArgs);
    server.messageReceived.subscribe(ServerDefaultCallback, ServerDefaultErrorCallback);
    server.listen(port=port, host=host);
}

main(process.argv);
