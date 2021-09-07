import { CommandInteraction } from 'discord.js';

interface ICommand {
  permissions: bigint[];
  run(interaction: CommandInteraction): Promise<void>;
  ensureUsage(interaction: CommandInteraction): Promise<boolean>;
}

export default ICommand;
