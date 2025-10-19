
import 'reflect-metadata';
import { Command, Option } from 'commander';
import * as Protocol from '../protocol';

export const program = new Command()
    .description('Scte104 parameters for splice request')
    .requiredOption('--dpi-pid-index <number>', 'Dpi pid index')
    .addOption(new Option('--splice-insert-type <number>', `Specify the type of the splice: ${Protocol.SPLICE_START_NORMAL}`).choices(['1', '2', '3', '4', '5']))
    .option('--splice-event-id <number>', '')
    .option('--unique-program-id <number>', '')
    .option('--pre-roll-time <number>', '')
    .option('--break-duration <number>', '')
    .option('--avail-num <number>', '')
    .option('--avails-expected <number>', '')
    .option('--auto-return-flag <number>', '')
//program.exitOverride((err) => { throw Error (err.message)}) 

//program.exitOverride((err) => { if (err.exitCode !== 0 ) { throw Error (err.message)}}) 
//program.parse(process.argv)