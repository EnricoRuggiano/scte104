import 'reflect-metadata';
import * as SCTE104 from "../../src";
import process = require('process');
import sleep  = require("sleep-promise");

async function main(argv : string[]) {

    SCTE104.program.parse(argv);
    let _args = SCTE104.program.opts()
    let initArgs   = new SCTE104.args.Init(_args);
    let spliceArgs = new SCTE104.args.Splice(_args);
    let aliveArgs  = new SCTE104.args.Alive(_args);
    let host = _args.host;
    let port = _args.port;
    process.env['logLevel'] = _args.logLevel;

    let client = new SCTE104.Client();
    await client.connect(host, port);
    await sleep(3000);
    await client.init(initArgs);
    await sleep(3000);
    await client.alive(aliveArgs);
    await sleep(3000);
    await client.splice(spliceArgs)
    await client.disconnect();
}

main(process.argv);