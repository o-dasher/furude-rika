import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientID, devGuildID, debug } from '@furude-json/Config.json';
import consola from 'consola';
import CommandsReader from '@furude-io/CommandsReader';
import * as dotenv from 'dotenv';

dotenv.config();

const commands = CommandsReader.getAllCommands().map((command) =>
  command.toJSON()
);
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

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
