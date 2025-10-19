import 'reflect-metadata';
import { describe, before, after } from "razmin";
import * as SCTE104 from "../src";
import { ServerDefaultCallback, ServerDefaultErrorCallback } from '../src/server-default-callback';

describe("SCTE-104 Client With Local Server", it => {
    let host:string = "127.0.0.1"
    let port:number = 5168
    let server = new SCTE104.Server({host:host, port:port});
    server.messageReceived.subscribe(ServerDefaultCallback, ServerDefaultErrorCallback);
    server.listen(port, host);

    let client:SCTE104.Client = null;
    let answer:SCTE104.syntax.SingleOperationMessage = null;

    before(async() => {
        client = new SCTE104.Client(new SCTE104.args.Config({host:host, port:port}));
        await client.connect(host, port);
    })
    after(async() => {
        await client.disconnect();
    })

    it('Client send SCTE104 initRequest', async () => {
        answer = await client.init({dpiPidIndex: 1000})
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    });
    it('Client send SCTE104 AliveRequest', async () => {
        answer = await client.alive(new SCTE104.args.Alive({dpiPidIndex: 1000}))
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    });
    it('Client send SCTE104 SpliceRequest Start Normal ', async() => {
        answer = await client.splice(new SCTE104.args.Splice({dpiPidIndex: 1000, spliceInsertType: SCTE104.SPLICE_START_NORMAL}))
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    })
    it('Client send SCTE104 SpliceRequest End Normal ', async() => {
        answer = await client.splice(new SCTE104.args.Splice({dpiPidIndex: 1000, spliceInsertType: SCTE104.SPLICE_END_NORMAL}))
        if (answer.result !== SCTE104.RESULT.SUCCESS) { throw Error(`${answer.result}`)}
    })
});