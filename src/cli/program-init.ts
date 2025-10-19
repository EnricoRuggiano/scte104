
import 'reflect-metadata';
import { Command } from 'commander';

export const program = new Command()
    .description('Scte104 parameters for init request')
    .requiredOption('--dpi-pid-index <number>', 'Dpi pid index')
