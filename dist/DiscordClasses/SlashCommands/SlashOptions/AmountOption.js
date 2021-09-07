"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const OptionHelper_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionHelper"));
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
class AmountOption extends builders_1.SlashCommandNumberOption {
    tag = OptionsTags_1.default.amount;
    constructor() {
        super();
        OptionHelper_1.default.build(this);
    }
    static getTag(interaction) {
        return interaction.options.getNumber(OptionsTags_1.default.amount);
    }
}
exports.default = AmountOption;
//# sourceMappingURL=AmountOption.js.map