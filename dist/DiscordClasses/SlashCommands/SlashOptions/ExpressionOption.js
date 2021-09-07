"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const OptionHelper_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionHelper"));
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
class ExpressionOption extends builders_1.SlashCommandStringOption {
    tag = OptionsTags_1.default.expression;
    constructor() {
        super();
        OptionHelper_1.default.build(this).setDescription('A mathematical expression.');
    }
    static getTag(interaction) {
        return interaction.options.getString(OptionsTags_1.default.expression);
    }
}
exports.default = ExpressionOption;
//# sourceMappingURL=ExpressionOption.js.map