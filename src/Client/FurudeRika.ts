import FurudeConfig from './FurudeConfig';
import { Client, Collection } from 'discord.js';
import consola from 'consola';
import Command from '../interfaces/Command';

class FurudeRika extends Client {
  public commands: Collection<string, Command> = new Collection();
  public config: FurudeConfig;

  public constructor(config: FurudeConfig) {
    super(config);
    this.config = config;
  }

  public start(): void {
    this.login(this.config.token);

    this.once('ready', (client) => {
      consola.success(client.user.username + ' logged succesfully!');
    });

    this.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        return;
      }

      command.run(interaction);
    });
  }
}

export default FurudeRika;
