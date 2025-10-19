
import 'reflect-metadata';
import { Command, Option } from 'commander';
import * as Protocol from '../protocol';

export const program = new Command()
    .description('Scte104 parameters for splice request')
    .requiredOption('--dpi-pid-index <number>', 'Dpi pid index')
    .addOption(new Option('--splice-insert-type <number>', 
        `Specify the type of the splice: e.g: SPLICE_START_NORMAL: ${Protocol.SPLICE_START_NORMAL}, SPLICE_START_IMMEDIATE: ${Protocol.SPLICE_START_IMMEDIATE}, SPLICE_END_NORMAL: ${Protocol.SPLICE_END_NORMAL}, SPLICE_END_IMMEDIATE: ${Protocol.SPLICE_END_IMMEDIATE}, SPLICE_CANCEL: ${Protocol.SPLICE_CANCEL}`).choices(['1', '2', '3', '4', '5']))
    .option('--splice-event-id <number>', 'Specify an ID for this splice event. Must be unique when the event is submitted, and remain unique until the event is processed', '1')
    .option('--unique-program-id <number>', 'SHOULD be the unique identifier of the viewing event that this splice event is designated for.', '1')
    .option('--pre-roll-time <number>', 'Specify the pre-roll time for this splice event in milliseconds. SCTE 104 specifies that pre-roll time SHALL be no less than 4000 millisecond', '4000')
    .option('--break-duration <number>', 'Specify the break duration for this splice in tenths of a seconds', '2400')
    .option('--avail-num <number>', 'Specify which "avail" this splice represents', '0')
    .option('--avails-expected <number>', 'Specify how many "avails" are expected during this event', '0')
    .option('--auto-return-flag <number>', 'Specify that this splice should automatically end without requiring a splice-end event', '0')
