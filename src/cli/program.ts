import 'reflect-metadata';
import { Command } from 'commander';
import { program as generalProgram} from './program-general'; 
import { getLogger } from '../logger';
//const PCK = {"description": "asd", "version": "1"}
const program = generalProgram;

program
  //.name(PCK.name)
  .name('scte104-cli')
  .description("Implementation of the SCTE-104 TCP/IP protocol")
  .version("1.0.69")

program
  .hook('preSubcommand', (thisCommand:Command, subCommand:Command) => {
    let _opts = thisCommand.opts();
    let _vars: {[key:string]:any}= {}
    for (let [key, value] of Object.entries(_opts)) {
      if (value)
        _vars[key] = value
    }
    let _key = thisCommand.name() + '-' + subCommand.name();
    process.env[_key]=JSON.stringify(_vars)
    process.env.logLevel = _opts.logLevel;   
    
    let logger = getLogger()
    logger.trace("Saving the following opts as an env variable")
    logger.trace(_vars)
    logger.trace(_key)
  })
  .command('do <string>', 'Execute a list of scte104 commands', {executableFile: "cli-do"})  
  //.command('interactive', 'Open an interactive shell to send scte104 commands')
  //.alias('i')

export default program