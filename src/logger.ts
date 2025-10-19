import { Logger as TsLogger, ILogObj  } from "tslog";
import process = require('process');

const _MAP = {0: 'silly', 1: 'trace', 2: 'debug', 3: 'info', 4: 'warning', 5: 'error', 6: 'fatal'};
const _MAP_REVERSE = Object.entries(_MAP).reverse().reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

const _tryLogLevel = () => process.env.logLevel ?? 'info';
const _getLogLevel = (logLevel:string) => parseInt(_MAP_REVERSE[logLevel.toLowerCase().trim()]) 

class Logger {
    static _instance:TsLogger<ILogObj>
    static _logLevel:string
    private constructor () {}
    public static get instance():Logger {        
        /**
         * if process.env.logLevel is overriden during the execution of the code (e.g: cli-program)
         * reinstantiate the logger instance
         */
        if (!Logger._instance || _tryLogLevel()!= Logger._logLevel) {
            Logger._logLevel = _tryLogLevel();
            Logger._instance = new TsLogger({minLevel: _getLogLevel(Logger._logLevel)})
        }
        return Logger._instance
    }
}

export const getLogger = () => Logger.instance as TsLogger<ILogObj>
export const logger = Logger.instance as TsLogger<ILogObj>
