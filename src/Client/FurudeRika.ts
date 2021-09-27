import { Client, Collection, Intents } from 'discord.js';
import consola from 'consola';
import ICommand from '@discord-classes/SlashCommands/ICommand';
import CommandsReader from '@furude-io/CommandsReader';
import OsuTracker from '@furude-utils/tasks/OsuTracker';
import DroidDataDumper from '@furude-utils/tasks/DroidDataDumper';

class FurudeRika extends Client {
  private droidTracker: OsuTracker = new OsuTracker(this);
  private droidDumper: DroidDataDumper = new DroidDataDumper(this);
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
      await this.droidTracker.start();
      await this.droidDumper.start();
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
    });
  }
}

export default FurudeRika;
