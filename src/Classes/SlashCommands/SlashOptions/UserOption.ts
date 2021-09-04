import { SlashCommandUserOption } from '@discordjs/builders';
import { CommandInteraction, User } from 'discord.js';
import CommandOption from './CommandOption';
import OptionHelper from './OptionHelper';
import OptionsTags from './OptionsTags';

class UserOption extends SlashCommandUserOption implements CommandOption {
  tag: string = OptionsTags.user;

  public constructor() {
    super();
    OptionHelper.build(this);
  }

  public static getTag(interaction: CommandInteraction): User {
    return interaction.options.getUser(OptionsTags.user);
  }
}

export default UserOption;
