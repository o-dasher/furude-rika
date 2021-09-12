import { CommandInteraction, GuildChannel, User } from 'discord.js';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';
import OptionHelper from '@discord-classes/SlashCommands/SlashOptions/OptionHelper';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import { APIInteractionDataResolvedChannel } from 'discord-api-types';
import { SlashCommandChannelOption } from '@discordjs/builders';

class ChannelOption extends SlashCommandChannelOption implements CommandOption {
  tag: string = OptionsTags.channel;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('A discord channel!');
  }

  public static getTag(
    interaction: CommandInteraction
  ): GuildChannel | APIInteractionDataResolvedChannel | null {
    return interaction.options.getChannel(OptionsTags.channel);
  }
}

export default ChannelOption;
