import fs from 'fs';
import path from 'path';
import CommandABC from '../interfaces/CommandABC';
import IOPaths from './IOPaths';

class CommandsReader {
  public static commandsPath: string = path.join(
    path.resolve('./'),
    IOPaths.srcPath,
    IOPaths.commandsPath
  );

  static getCommands(): CommandABC[] {
    const commandsStrings = fs
      .readdirSync(this.commandsPath)
      .filter((file) => file.endsWith('.ts'));

    const commands: CommandABC[] = [];

    for (const file of commandsStrings) {
      const command: CommandABC = require(`${this.commandsPath}${file}`).default
        .data;
      commands.push(command);
    }

    return commands;
  }
}

export default CommandsReader;
