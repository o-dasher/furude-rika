import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import { CommandInteraction, User } from 'discord.js';


abstract class InteractionHelper {
  private constructor() {}
  
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
