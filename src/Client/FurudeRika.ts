import { Client, Collection, Intents } from 'discord.js';
import consola from 'consola';
import ICommand from '@discord-classes/SlashCommands/ICommand';
import CommandsReader from '@furude-io/CommandsReader';
import DroidTracker from '@furude-utils/handler/DroidTracker';

class FurudeRika extends Client {
  private droidTracker: DroidTracker = new DroidTracker(this);
  public commands: Collection<string, ICommand> = new Collection();

  public constructor() {
    super({
      intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS]
    });

    const allCommands = CommandsReader.getAllCommands();
    allCommands.forEach((command) => {
      this.commands.set(command.name, command);
    });
  }

  private logLogin(client: Client): void {
    consola.success(client.user!.username + ' logged succesfully!');
  }

  public start(): void {
    this.login(process.env.BOT_TOKEN);

    this.once('ready', async (client) => {
      this.logLogin(client);
      await this.droidTracker.startTracking();
    });

    this.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) {
        return;
      }

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        return;
      }

      consola.success(
        `Running command requested from ${interaction.user.toString()} in channel: ${
          interaction.channel?.id
        } on server: ${interaction.guild?.name}`
      );
      command.run(interaction);
    });

    process.on('unhandledRejection', (err) => {
      consola.error(err);
      setTimeout(() => {
        consola.success('Reseting from previous Exception');
        this.login(process.env.BOT_TOKEN);
        this.logLogin(this);
      }, 2500);
    });
  }
}

export default FurudeRika;
