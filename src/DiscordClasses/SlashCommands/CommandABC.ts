import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import ICommand from '@discord-classes/SlashCommands/ICommand';
import SubCommandABC from '@discord-classes/SlashCommands/SubCommandABC';

abstract class CommandABC extends SlashCommandBuilder implements ICommand {
  private readonly subCommands: SubCommandABC[] = [];
  abstract run(interaction: CommandInteraction): Promise<void>;
  public addSelfSubcommand(subcommand: SubCommandABC): SubCommandABC {
    super.addSubcommand(subcommand);
    this.subCommands.push(subcommand);
    return subcommand;
  }
  public getSubcommand(subCommandString: string): SubCommandABC {
    return this.subCommands.filter((c) => c.name === subCommandString)[0];
  }
}

export default CommandABC;
