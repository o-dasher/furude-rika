import { SlashCommandNumberOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import CommandOption from './CommandOption';
import OptionHelper from './OptionHelper';
import OptionsTags from './OptionsTags';

class AmountOption extends SlashCommandNumberOption implements CommandOption {
  tag: string = OptionsTags.amount;

  public constructor() {
    super();
    OptionHelper.build(this);
  }

  public static getTag(interaction: CommandInteraction): number | null {
    return interaction.options.getNumber(OptionsTags.amount);
  }
}

export default AmountOption;
