import { SlashCommandUserOption } from '@discordjs/builders';
import { CommandInteraction, User } from 'discord.js';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';
import OptionHelper from '@discord-classes/SlashCommands/SlashOptions/OptionHelper';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';

class UserOption extends SlashCommandUserOption implements CommandOption {
  tag: string = OptionsTags.user;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('A discord user!');
  }

  public static getTag(interaction: CommandInteraction): User | null {
    return interaction.options.getUser(OptionsTags.user);
  }
}

export default UserOption;
