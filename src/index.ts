import FurudeConfig from './Client/FurudeConfig';
import FurudeRika from './Client/FurudeRika';
import * as configParams from './json/config.json';
import CommandsReader from './IO/CommandsReader';
import Localizer from './Localization/Localizer';

Localizer.init();

const config = new FurudeConfig(configParams);
const client = new FurudeRika(config);

const commands = CommandsReader.getCommands();

for (const command of commands) {
  client.commands.set(command.name, command);
}

client.start();
