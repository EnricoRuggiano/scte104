
import 'reflect-metadata';
import { program as aliveProgram } from './program-alive';

aliveProgram.exitOverride((err) => { if (err.exitCode !== 0 ) { throw Error (err.message)}}) 
aliveProgram.parse(process.argv)