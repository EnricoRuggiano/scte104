
import 'reflect-metadata';
import prompts from "prompts";
import { Command } from 'commander';
import * as SCTE104 from '..';
const PCK = require('../../package.json');

const program = new Command();

console.log('interactive')