import { Client, Collection, Intents } from 'discord.js';
import consola from 'consola';
import ICommand from '@furude-commands/ICommand';

class FurudeRika extends Client {
  public commands: Collection<string, ICommand> = new Collection();

  public constructor() {
    super({
      intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS]
    });
  }

  private logLogin(client: Client): void {
    consola.success(client.user!.username + ' logged succesfully!');
  }

  public start(): void {
    this.login(process.env.BOT_TOKEN);

    this.once('ready', (client) => {
      this.logLogin(client);
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

    process.on('unhandledRejection', (err) => {
      consola.error(err);
      consola.success('Reseting from previous Exception');
      this.login(process.env.BOT_TOKEN);
      this.logLogin(this);
    });
  }
}

export default FurudeRika;
