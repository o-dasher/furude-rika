import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import ICommand from '@discord-classes/SlashCommands/ICommand';
import CommandHelper from './CommandHelper';

abstract class SubCommandABC
  extends SlashCommandSubcommandBuilder
  implements ICommand
{
  permissions: bigint[] = [];
  ensureUsage(interaction: CommandInteraction): Promise<boolean> {
    return CommandHelper.checkPermissions(interaction, this.permissions);
  }
  abstract run(interaction: CommandInteraction): Promise<void>;
}

export default SubCommandABC;
