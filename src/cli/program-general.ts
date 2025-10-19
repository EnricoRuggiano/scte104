
import 'reflect-metadata';
import { Command } from 'commander';

export const program = new Command()
  .requiredOption('-h, --host <string>', 'scte104 server address')
  .requiredOption('-p, --port <number>', 'scte104 server port', '5167')
  .option('--log-level <string>', 'Log level used by the client code', 'info')
  .option('--buffer-size <number>', 'size in bytes used by the client to store incoming data from the TCP socket. It should be greater than the maximum message length in bytes received', '100')
  .option('--wait <number>', 'how many millis the client should wait before performing a scte104 operation', '1000')
  .option('--message-number <number>', 'starting number of the first message sent by the client to the scte104 server. Used to match the received messages from the sent ones', '1')
