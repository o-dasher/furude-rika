import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import Command from '../interfaces/Command';

abstract class SubCommandABC
  extends SlashCommandSubcommandBuilder
  implements Command
{
  abstract run(interaction: CommandInteraction): void;
}

export default SubCommandABC;
