import { SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';

abstract class SubCommandGroup extends SlashCommandSubcommandGroupBuilder {
  private subcommands: SubCommand[] = [];

  public addSelfSubCommand(subCommand: SubCommand): SubCommand {
    super.addSubcommand(subCommand);
    this.subcommands.push(subCommand);
    return subCommand;
  }

  public getSubCommand(subGroupString: string): SubCommand {
    return this.subcommands.filter((c) => c.name === subGroupString)[0];
  }

  public getSubCommands(): SubCommand[] {
    return this.subcommands;
  }
}

export default SubCommandGroup;
