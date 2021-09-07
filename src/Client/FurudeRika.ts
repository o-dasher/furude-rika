import { Client, Collection, Intents } from 'discord.js';
import consola from 'consola';
import ICommand from '@discord-classes/SlashCommands/ICommand';
import CommandsReader from '@furude-io/CommandsReader';

class FurudeRika extends Client {
  public commands: Collection<string, ICommand> = new Collection();

  public constructor() {
    super({
      intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS]
    });

    const allCommands = CommandsReader.getAllCommands();

    for (const command of allCommands) {
      this.commands.set(command.name, command);
    }
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
      console.log('H');
      if (!interaction.isCommand()) {
        return;
      }

      console.log('TUS');

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
      consola.success('Reseting from previous Exception');
      this.login(process.env.BOT_TOKEN);
      this.logLogin(this);
    });
  }
}

export default FurudeRika;
