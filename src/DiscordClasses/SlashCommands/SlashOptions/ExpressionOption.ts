import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import CommandOption from './CommandOption';
import OptionHelper from './OptionHelper';
import OptionsTags from './OptionsTags';

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
