import fs from 'fs';
import path from 'path';
import CommandABC from '../interfaces/CommandABC';
import IOPaths from './IOPaths';

class CommandsReader {
  public static commandsPath = path.join(
    path.resolve('./'),
    IOPaths.srcPath,
    IOPaths.commandsPath
  );

  public static funPath = '/fun/';
  public static moderationPath = '/moderation/';
  public static toolsPath = '/tools/';
  public static paths = [
    CommandsReader.funPath,
    CommandsReader.moderationPath,
    CommandsReader.toolsPath
  ];

  public static getAllCommands(): CommandABC[] {
    const commands: CommandABC[] = [];

    for (const pathname of CommandsReader.paths) {
      commands.push.apply(commands, CommandsReader.getCommands(pathname));
    }

    return commands;
  }

  private static getCommands(subpath?: string): CommandABC[] {
    const fullpath = this.commandsPath.concat(subpath ?? '');
    const commandsStrings = fs
      .readdirSync(fullpath)
      .filter((file) => file.endsWith('.ts'));

    const commands: CommandABC[] = [];

    for (const file of commandsStrings) {
      const command: CommandABC = require(`${fullpath}${file}`).default.data;
      commands.push(command);
    }

    return commands;
  }
}

export default CommandsReader;
