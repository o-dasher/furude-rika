"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
class CommandABC extends builders_1.SlashCommandBuilder {
    subCommands = [];
    addSelfSubcommand(subcommand) {
        super.addSubcommand(subcommand);
        this.subCommands.push(subcommand);
        return subcommand;
    }
    getSubcommand(subCommandString) {
        return this.subCommands.filter((c) => c.name === subCommandString)[0];
    }
}
exports.default = CommandABC;
//# sourceMappingURL=CommandABC.js.map