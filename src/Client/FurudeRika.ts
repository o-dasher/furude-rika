import { Client, Collection, Intents } from 'discord.js';
import consola from 'consola';
import ICommand from '../Interfaces/ICommand';
import { token } from '../json/Config.json';

class FurudeRika extends Client {
  public commands: Collection<string, ICommand> = new Collection();

  public constructor() {
    super({
      intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS]
    });
  }

  public start(): void {
    this.login(token);

    this.once('ready', (client) => {
      consola.success(client.user.username + ' logged succesfully!');
    });

    this.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) {
        return;
      }

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        return;
      }

      command.run(interaction);
    });
  }
}

export default FurudeRika;
