import { SlashCommandOptionBase } from '@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';

class OptionHelper {
  public static build(
    option: CommandOption & SlashCommandOptionBase
  ): CommandOption & SlashCommandOptionBase {
    return option.setName(option.tag);
  }
}

export default OptionHelper;
