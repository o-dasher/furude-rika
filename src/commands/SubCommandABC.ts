import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import ICommand from '../interfaces/ICommand';

abstract class SubCommandABC
  extends SlashCommandSubcommandBuilder
  implements ICommand
{
  abstract run(interaction: CommandInteraction): Promise<void>;
}

export default SubCommandABC;
