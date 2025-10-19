import 'reflect-metadata';
import { Command } from 'commander';
import { program as initProgram } from './program-init';

export const program = initProgram
        .description('Scte104 parameters for alive request')
