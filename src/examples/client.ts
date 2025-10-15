import 'reflect-metadata';
import * as SCTE104 from "../../src";
import process = require('process');
import sleep  = require("sleep-promise");
import { logger } from "../../src/logger"

async function main(argv : string[]) {
    let host:string        = process.env.host;
    let port:number        = parseInt(process.env.port);
    let dpiPidIndex:number = parseInt(process.env.dpiPidIndex);

    let client = new SCTE104.Client();
    await client.connect(host, port);
    await sleep(3000);
    await client.init(dpiPidIndex);
    logger.info("Client SENT INIT REQUEST CORRECTLY")
    await sleep(3000);
    await client.alive(dpiPidIndex);
    logger.info("CLient SENT ALIVE REQUEST CORRECTLY")
    await sleep(3000);
    await client.splice(dpiPidIndex)
    logger.info("CLient SENT SPLICE REQUEST CORRECTLY")
    await client.disconnect();
}

main(process.argv.slice(1));