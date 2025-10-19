
import 'reflect-metadata';
import { Command } from 'commander';
//import { program as initProgram } from './cli-do-init';
import { program as aliveProgram } from './program-alive';

aliveProgram.exitOverride((err) => { if (err.exitCode !== 0 ) { throw Error (err.message)}}) 
aliveProgram.parse(process.argv)