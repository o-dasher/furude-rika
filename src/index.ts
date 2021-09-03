import ConfigParams from './Client/ConfigParams';
import FurudeConfig from './Client/FurudeConfig';
import FurudeRika from './Client/FurudeRika';
import fs from 'fs';
import { token, defaultPrefixes } from './json/config.json';
import CommandsReader from './IO/CommandsReader';


const configParams: ConfigParams = {
  token: token,
  defaultPrefixes: defaultPrefixes
};

const config = new FurudeConfig(configParams);
const client = new FurudeRika(config);

const commands = CommandsReader.getCommands();

for (const command of commands) {
  client.commands.set(command.name, command);
}

client.start();
