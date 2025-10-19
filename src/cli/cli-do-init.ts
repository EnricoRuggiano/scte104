
import 'reflect-metadata';
import { program as initProgram } from './program-init';

initProgram.exitOverride((err) => { if (err.exitCode !== 0 ) { throw Error (err.message)}}) 
initProgram.parse(process.argv)