import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import CommandOption from '../CommandOption';
import OptionHelper from '../OptionHelper';
import OptionsTags from '../OptionsTags';

class OsuUserOption extends SlashCommandStringOption implements CommandOption {
  tag: string = OptionsTags.osuUser;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('The choosen osu! user');
  }

  public static getTag(interaction: CommandInteraction): string {
    return interaction.options.getString(OptionsTags.osuUser);
  }
}

export default OsuUserOption;
