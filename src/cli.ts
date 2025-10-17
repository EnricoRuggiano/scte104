import { Command } from 'commander';

// const program = new Command();
//program
export const program = new Command()
    .option('-p, --port <number>', 'server port number')
    .option('-h, --host <string>')
    .option('--log-level <string>', 'Log level')
    .option('--dpi-pid-index <number>', 'Dpi Pid index')
    .option('--splice-insert-type <number>', "")
    .option('--splice-event-id <number>', '')
    .option('--unique-program-id <number>', '')
    .option('--pre-roll-time <number>', '')
    .option('--break-duration <number>', '')
    .option('--avail-num <number>', '')
    .option('--avails-expected <number>', '')
    .option('--auto-return-flag <number>', '')
    .option('--wait <number>')
    .option('--message-number <number>')
    .option('--buffer-size <number>')