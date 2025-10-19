
import 'reflect-metadata';
import { Command } from 'commander';
import { program as ProgramGeneral } from './program-general'
import { program as ProgramSplice } from './program-splice'

const program = new Command();
const addOption = (_program : Command) => { _program.options.forEach((opt) => program.addOption(opt))}
addOption(ProgramGeneral)
addOption(ProgramSplice)
export { program }
