import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import Command from './Command';
import SubCommandABC from './SubCommandABC';

abstract class CommandABC extends SlashCommandBuilder implements Command {
  private readonly subCommands: SubCommandABC[] = [];
  abstract run(interaction: CommandInteraction): void;
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
