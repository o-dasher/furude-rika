import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';

import ICommand from '@discord-classes/SlashCommands/ICommand';
import SubCommandABC from '@discord-classes/SlashCommands/SubCommandABC';
import CommandHelper from '@discord-classes/SlashCommands/CommandHelper';


abstract class CommandABC extends SlashCommandBuilder implements ICommand {
  permissions: bigint[] = [];
  private readonly subCommands: SubCommandABC[] = [];

  abstract run(interaction: CommandInteraction): Promise<void>;

  public async ensurePermissions(
    interaction: CommandInteraction
  ): Promise<boolean> {
    return await CommandHelper.checkPermissions(interaction, this.permissions);
  }

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
