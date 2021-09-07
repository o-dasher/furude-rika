import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';
import OptionHelper from '@discord-classes/SlashCommands/SlashOptions/OptionHelper';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';

class ExpressionOption
  extends SlashCommandStringOption
  implements CommandOption
{
  tag: string = OptionsTags.expression;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('A mathematical expression.');
  }

  public static getTag(interaction: CommandInteraction): string | null {
    return interaction.options.getString(OptionsTags.expression);
  }
}

export default ExpressionOption;
