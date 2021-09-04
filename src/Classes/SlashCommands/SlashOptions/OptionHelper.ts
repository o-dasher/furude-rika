import { SlashCommandOptionBase } from '@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase';
import CommandOption from './CommandOption';

class OptionHelper {
  public static build(option: CommandOption & SlashCommandOptionBase): void {
    option.setName(option.tag);
  }
}

export default OptionHelper;
