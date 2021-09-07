"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const IOPaths_1 = __importDefault(require("@furude-io/IOPaths"));
class CommandsReader {
    static commandsPath = path_1.default.join(path_1.default.resolve('./'), IOPaths_1.default.srcPath, IOPaths_1.default.commandsPath);
    static funPath = '/fun/';
    static moderationPath = '/moderation/';
    static toolsPath = '/tools/';
    static osuPath = '/osu/';
    static ownerPath = '/owner/';
    static paths = [
        CommandsReader.funPath,
        CommandsReader.moderationPath,
        CommandsReader.toolsPath,
        CommandsReader.osuPath,
        CommandsReader.ownerPath
    ];
    static getAllCommands() {
        const commands = [];
        for (const pathname of CommandsReader.paths) {
            commands.push.apply(commands, CommandsReader.getCommands(pathname));
        }
        return commands;
    }
    static getCommands(subpath) {
        const fullpath = this.commandsPath.concat(subpath ?? '');
        const commandsStrings = fs_1.default
            .readdirSync(fullpath)
            .filter((file) => file.endsWith('.ts'));
        const commands = [];
        for (const file of commandsStrings) {
            const command = require(`${fullpath}${file}`).default.data;
            commands.push(command);
        }
        return commands;
    }
}
exports.default = CommandsReader;
//# sourceMappingURL=CommandsReader.js.map