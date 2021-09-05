import { CommandInteraction, User } from 'discord.js';
import OptionsTags from '../SlashCommands/SlashOptions/OptionsTags';

class InteractionHelper {
  public static defaultOptionalUser(interaction: CommandInteraction): User {
    return interaction.options.getUser(OptionsTags.user) ?? interaction.user;
  }
  public static defaultOptionalNumber(
    number: number,
    defaultNumber: number
  ): number {
    return number ?? defaultNumber;
  }
}

export default InteractionHelper;
