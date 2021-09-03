import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientID, devGuildID, token } from '../json/config.json';
import consola from 'consola';
import CommandsReader from '../IO/CommandsReader';

const isDev = false;

const commands = CommandsReader.getCommands().map((command) => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  const req = {  body: commands }
  try {
    await rest.put(
      isDev?
        Routes.applicationGuildCommands(clientID, devGuildID) : 
        Routes.applicationCommands(clientID)
    , req);
    consola.success('Successfully registered application commands.');
  } catch (error) {
    consola.error(error);
  }
})();
