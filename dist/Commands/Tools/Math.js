"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressionOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/ExpressionOption"));
const CommandABC_1 = __importDefault(require("@furude-commands/CommandABC"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
const mathjs_1 = require("mathjs");
class Math extends CommandABC_1.default {
    constructor() {
        super();
        this.setName('math').setDescription('Evaluates a mathematical expression');
        this.addStringOption(new ExpressionOption_1.default().setRequired(true));
    }
    async run(interaction) {
        await interaction.deferReply();
        const expression = ExpressionOption_1.default.getTag(interaction) ?? '';
        let cantSolve = expression == '';
        let result = 0;
        try {
            result = (0, mathjs_1.evaluate)(expression);
        }
        catch (err) {
            cantSolve = true;
        }
        if (cantSolve) {
            await interaction.reply(` ** ${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.mathEvalError).replace('EXPRESSION', expression)} **
        `);
            return;
        }
        await interaction.editReply(`** ${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.mathReply)
            .replace('EXPRESSION', expression)
            .replace('RESULT', result.toString())} **
      `);
    }
}
exports.default = {
    data: new Math()
};
//# sourceMappingURL=Math.js.map