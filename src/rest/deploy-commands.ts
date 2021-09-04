import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientID, devGuildID, token, debug } from '../json/config.json';
import consola from 'consola';
import CommandsReader from '../IO/CommandsReader';

const commands = CommandsReader.getAllCommands().map((command) =>
  command.toJSON()
);
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  const req = { body: commands };
  try {
    await rest.put(
      debug
        ? Routes.applicationGuildCommands(clientID, devGuildID)
        : Routes.applicationCommands(clientID),
      req
    );
    consola.success('Successfully registered application commands.');
  } catch (error) {
    consola.error(error);
  }
})();
