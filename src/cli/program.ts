import 'reflect-metadata';
import { Command } from 'commander';
import { program as generalProgram} from './program-general'; 
import { getLogger } from '../logger';
const PCK = {"description": "asd", "version": "1"}//require('../../package.json');
const program = generalProgram;

program
  //.name(PCK.name)
  .name('cli')
  .description(PCK.description)
  .version(PCK.version)

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
  .command('do <string>', 'Execute a list of scte104 commands')  
  //.command('interactive', 'Open an interactive shell to send scte104 commands')
  //.alias('i')

export default program