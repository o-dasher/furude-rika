"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
class IndexOption extends builders_1.SlashCommandNumberOption {
    tag = OptionsTags_1.default.index;
    constructor() {
        super();
        this.setName(this.tag);
    }
    static getTag(interaction) {
        return (interaction.options.getNumber(OptionsTags_1.default.index) ?? 1) - 1;
    }
}
exports.default = IndexOption;
//# sourceMappingURL=IndexOption.js.map