import 'reflect-metadata';
import { program as spliceProgram } from './program-splice';

spliceProgram.exitOverride((err) => { if (err.exitCode !== 0 ) { throw Error (err.message)}}) 
spliceProgram.parse(process.argv)