import { SlashCommandNumberOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';

class IndexOption extends SlashCommandNumberOption implements CommandOption {
  tag: string = OptionsTags.index;

  public constructor() {
    super();
    this.setName(this.tag);
  }

  public static getTag(interaction: CommandInteraction) {
    return (interaction.options.getNumber(OptionsTags.index) ?? 1) - 1;
  }
}

export default IndexOption;
