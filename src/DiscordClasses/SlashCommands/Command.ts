import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import ICommand from '@discord-classes/SlashCommands/ICommand';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';
import CommandHelper from '@discord-classes/SlashCommands/CommandHelper';
import SubCommandGroup from './SubCommandGroup';
import StringUtils from '@furude-utils/StringUtils';

abstract class Command extends SlashCommandBuilder implements ICommand {
  permissions: bigint[] = [];
  private readonly subCommands: SubCommand[] = [];
  private readonly subGroups: SubCommandGroup[] = [];

  abstract run(interaction: CommandInteraction): Promise<void>;

  public async ensureUsage(interaction: CommandInteraction): Promise<boolean> {
    return await CommandHelper.checkPermissions(interaction, this.permissions);
  }

  public addSelfSubGroup(group: SubCommandGroup): SubCommandGroup {
    super.addSubcommandGroup(group);
    this.subGroups.push(group);
    return group;
  }

  public addSelfSubcommand(subcommand: SubCommand): SubCommand {
    super.addSubcommand(subcommand);
    this.subCommands.push(subcommand);
    return subcommand;
  }

  public getSubGroup(subGroupString: string): SubCommandGroup {
    return this.subGroups.filter((c) => c.name === subGroupString)[0];
  }

  public getSubcommand(subCommandString: string): SubCommand {
    return this.subCommands.filter((c) => c.name === subCommandString)[0];
  }

  public async runSubCommand(interaction: CommandInteraction) {
    let group = null;
    let sub = null;

    if (this.subGroups.length > 0) {
      try {
        group = interaction.options.getSubcommandGroup();
      } catch (err) {}
    }
    if (this.subCommands.length > 0) {
      try {
        sub = interaction.options.getSubcommand();
      } catch (err) {}
    }

    let cmd =
      group && sub
        ? this.getSubGroup(group).getSubCommand(sub)
        : sub
        ? this.getSubcommand(sub)
        : null;

    if (cmd) {
      await cmd.run(interaction);
    } else {
      await interaction.reply(StringUtils.errorString('Command not found.'));
    }
  }
}

export default Command;
