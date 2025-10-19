import 'reflect-metadata';
import { describe, before, after } from "razmin";
import * as SCTE104 from "../src";
import process = require('process');

describe("SCTE-104 Client With Remote Server", it => {
    let host:string = process.env.host 
    let port:number = parseInt(process.env.port)
    let dpiPidIndex:number = parseInt(process.env.dpiPidIndex)

    let client:SCTE104.Client = null;
    let answer:SCTE104.syntax.SingleOperationMessage = null;

    if (!host || !port || !dpiPidIndex)
        throw Error ("Wrong .local.env file - please create a new one with host, port, dpiPidIndex to run this test");

    before(async() => {
        client = new SCTE104.Client(new SCTE104.args.Config({host:host, port:port}));
        await client.connect(host, port);
        await client.init({dpiPidIndex: dpiPidIndex}) // Mandatory a InitRequest
    })
    after(async() => {
        await client.disconnect();
    })

    it('Client send SCTE104 initRequest', async () => {
        answer = await client.init({dpiPidIndex: dpiPidIndex})
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    });
    it('Client send SCTE104 AliveRequest', async () => {
        answer = await client.alive(new SCTE104.args.Alive({dpiPidIndex: dpiPidIndex}))
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    });
    it('Client send SCTE104 SpliceRequest Start Normal ', async() => {
        answer = await client.splice(new SCTE104.args.Splice({dpiPidIndex: dpiPidIndex, spliceInsertType: SCTE104.SPLICE_START_NORMAL}))
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    })
    it('Client send SCTE104 SpliceRequest End Normal ', async() => {
        answer = await client.splice(new SCTE104.args.Splice({dpiPidIndex: dpiPidIndex, spliceInsertType: SCTE104.SPLICE_END_NORMAL}))
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    })
});