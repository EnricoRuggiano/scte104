
import 'reflect-metadata';
// import prompts from "prompts";
import { Command, OptionValues } from 'commander';
import * as SCTE104 from '..';
import { program as spliceProgram } from './program-splice';
import { program as aliveProgram }  from './program-alive';
import { program as initProgram }   from './program-init'; //'./cli-do-init';
import sleep  = require("sleep-promise");
import { getLogger } from '../logger';

let client: SCTE104.Client = null;
let logger = getLogger()
let opts = null

const program = new Command();
program
    .description(`Execute a list of scte104 commands. The list of commands must be passed as a string and must be separated using the characer <sep>\ne.g: do "init <init-options><sep> alive <alive-options><sep> splice <splice-options><sep>`)
    .option('--sep <string>', "separator charcter used to split the argument of 'do' string in a list of commands", ";")    
    .argument('<cmds>')
    .hook('preAction', async (cmd) => {
        logger.info(cmd.name())
        _restoreParentOptions(cmd);
        logger.debug("Restoring the following optional parameters from the internal env variable")
        logger.debug(cmd.opts())
        await connect(cmd.opts())
    })
    //.command('do <cmds>', { isDefault: true})
    .action( async function (this: Command, cmds:string) {
        let _cmds : string[] = cmds.split(this.opts().sep).filter(Boolean).map(s=>s.trim()) // <splice ....>;<alive>....;
        for (let _cmd of _cmds) {
            let _first:string = _cmd.split(' ')[0];
            logger.info(`CLIENT] Performing SCTE104 ${_first} operation`)
            logger.debug(`arguments passed: ${_cmd.split(' ')}`)
            try {
                let _program:Command = _availCmd(_first);
                _program.exitOverride((err) => { if (err.exitCode !== 0 ) { throw Error (err.message)}})                
                let args = _getArgs(_cmd.split(' '), _program)
                await run(_first, args.opts())
            } catch (error) {
                logger.error(`CLIENT] Skipping operation ${_first} because an exception as been caught`)
                logger.error(error)
            }
        }
    })
    .hook('postAction', async () => {
        logger.trace('Cleanup stuff after performing the main action')
        await disconnect()
    })

// empty subcommands that shows the helpers of the commands
program
    .command('init <opts>', "send a scte104 init message")
    .command('splice <opts>', "send a scte104 splice message")
    .command('alive <opts>', "send a scte104 alive message")

const connect = async (args:SCTE104.args.ConfigArgs) => {
    client = new SCTE104.Client(args)
    await client.connect(args.host, args.port)
    await sleep(args.wait)
}

const run = async (cmd:string, _args:OptionValues) => {
    if (!client)
        program.error('client not instanced correctly');
    if (cmd == 'splice')
        await client.splice(new SCTE104.args.Splice(_args))
    else if (cmd == "alive")
        await client.alive(new SCTE104.args.Alive(_args))
    else if (cmd == "init")
        await client.init(new SCTE104.args.Init(_args))
    else
        throw Error(`Error command not supported ${cmd}`)
    await sleep(client.wait)
}

const disconnect = async () => {
    if (client)
        await client.disconnect()
}

const _availCmd = (cmd_str:string) => {
    let _cmd_str = cmd_str.toLowerCase().trim();
    if (_cmd_str == 'splice')
        return spliceProgram;
    else if (_cmd_str == 'alive')
        return aliveProgram
    else if (_cmd_str == 'init')
        return initProgram
    else 
        throw program.error(`Not valid command ${cmd_str}`)
}

const _getArgs = (args:string[], cmd:Command) => {
    args = [process.argv[1]].concat(args)
    return cmd.parse(args);
}

/**
 * WARNING!!! 
 * This is really bad! I am getting the parent's options parsed using an env variable.
 * To avoid this, I should probably merge all the subcommands in only one file and use 
 * GlobalOptions...    
 * @param command
 */
const _restoreParentOptions = (command:Command) => {
    let _opts = JSON.parse((String(process.env[command.name()] ?? "{}")))
    for (let [key, value] of Object.entries(_opts)) {
        command.setOptionValue(key, value)
    }
} 

program.parse(process.argv)