import 'reflect-metadata';
import { describe, before, after } from "razmin";
import * as SCTE104 from "../src";
import { ServerDefaultCallback, ServerDefaultErrorCallback } from '../src/server-default-callback';
import program from '../src/cli/program';
const fs = require("fs");
import { Command } from 'commander';
const path = require('path');
import { exec, execSync, spawnSync } from 'child_process';
//const { spawn } = require ('child_process');

describe("SCTE-104 Client CLI Tests ", async it => {
    let host:string = "127.0.0.1"
    let port:number = 5167

    const getStdout = (buffer:Buffer) => Buffer.from(buffer).toString();
    const cli = (opts=[]) => path.join(__dirname, '..', 'src', 'cli', 'cli.js', ...opts)
    const cmd = (argv:any[]) :string => `node ${cli()} ${argv.join(' ')}`;
    const _test = (argv:any[]) => { 
        let _cmd = cmd(argv);
        console.log(`Testing: ${_cmd}`)
        execSync(_cmd, {maxBuffer: 1024 * 1024 * 1024})
    }

    let server:SCTE104.Server = null;
    before(async() => {
        server = new SCTE104.Server({host:host, port:port});
        server.messageReceived.subscribe(ServerDefaultCallback, ServerDefaultErrorCallback);
        await server.listen(port, host);
    })
    after(async() => {
        await server.close();
    })
    
    it('Helper of main cli', () => {
        const argv = ["--help"]
        const res = _test(argv)
    });
    it('Helper of do cli', () => {
        const argv = ["--host", host, "--port", port, "--log-level", "trace", "do", '', "--help"]
        const res = _test(argv)
    });
    it('Helper of do init-cli', () => {
        const argv = ["--host", host, "--port", port, "do", "init", "--help"]
        const res = _test(argv)
    })
    it('Helper of do alive-cli', () => {
        const argv = ["--host", host, "--port", port, "do", "alive", "--help"]
        const res = _test(argv)
    })
    it('Helper of do splice-cli', () => {
        const argv = ["--host", host, "--port", port, "do", "splice", "--help"]
        const res = _test(argv)
    })
    it('cli-do send main scte104', ()=> {
        const argv = ["--host", host, "--port", port, "do", `"init --dpi-pid-index 1000; alive --dpi-pid-index 1000; splice --dpi-pid-index 1000 --splice-insert-type 1; splice --dpi-pid-index 1000 --splice-insert-type 2;"`]
        const res = _test(argv)
    })
});