"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const OptionHelper_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionHelper"));
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
class UserOption extends builders_1.SlashCommandUserOption {
    tag = OptionsTags_1.default.user;
    constructor() {
        super();
        OptionHelper_1.default.build(this).setDescription('A discord user!');
    }
    static getTag(interaction) {
        return interaction.options.getUser(OptionsTags_1.default.user);
    }
}
exports.default = UserOption;
//# sourceMappingURL=UserOption.js.map