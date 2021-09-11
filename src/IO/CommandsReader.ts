import fs from 'fs';
import path from 'path';
import Command from '@discord-classes/SlashCommands/Command';
import IOPaths from '@furude-io/IOPaths';

class CommandsReader {
  public static commandsPath = path.join(
    path.resolve('./'),
    IOPaths.srcPath,
    IOPaths.commandsPath
  );

  public static funPath = 'fun/';
  public static moderationPath = 'moderation/';
  public static toolsPath = 'tools/';
  public static osuPath = 'osu/';
  public static ownerPath = 'owner/';
  public static paths = [
    CommandsReader.funPath,
    CommandsReader.moderationPath,
    CommandsReader.toolsPath,
    CommandsReader.osuPath
  ];

  public static getAllCommands(): Command[] {
    const commands: Command[] = [];
    CommandsReader.paths.forEach((pathname) => {
      commands.push.apply(commands, CommandsReader.getCommands(pathname));
    });

    return commands;
  }

  private static getCommands(subpath?: string): Command[] {
    const fullpath = this.commandsPath.concat(subpath ?? '');
    const commandsStrings = fs
      .readdirSync(fullpath)
      .filter((file) => file.endsWith('.ts'));

    const commands: Command[] = [];
    commandsStrings.forEach((file) => {
      const command: Command = require(`${fullpath}${file}`).default.data;
      commands.push(command);
    });

    return commands;
  }
}

export default CommandsReader;
