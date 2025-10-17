import { Logger, ILogObj  } from "tslog";
import process = require('process');
import { program } from "./cli";

const _MAP = {0: 'silly', 1: 'trace', 2: 'debug', 3: 'info', 4: 'warning', 5: 'error', 6: 'fatal'};
const _MAP_REVERSE = Object.entries(_MAP).reverse().reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});
program.parse(process.argv)
const _LEVEL = program.opts().logLevel ?? process.env.logLevel ?? 'info';
const LOG_LEVEL = parseInt(_MAP_REVERSE[_LEVEL.toLowerCase().trim()]) 
export const logger:Logger<ILogObj> = new Logger({minLevel: LOG_LEVEL});
