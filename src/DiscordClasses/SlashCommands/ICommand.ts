import { CommandInteraction } from 'discord.js';

interface ICommand {
  run(interaction: CommandInteraction): Promise<void>;
}

export default ICommand;
