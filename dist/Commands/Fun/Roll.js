"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const CommandABC_1 = __importDefault(require("@furude-commands/CommandABC"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
const RandomHelper_1 = __importDefault(require("Math/RandomHelper"));
class Roll extends CommandABC_1.default {
    boundTag = 'bound';
    constructor() {
        super();
        this.setName('roll').setDescription('Randomly picks a number within a certain bound');
        this.addNumberOption(new builders_1.SlashCommandNumberOption()
            .setName(this.boundTag)
            .setDescription('The bound number for the roll')
            .setRequired(true));
    }
    async run(interaction) {
        const bound = interaction.options.getNumber(this.boundTag, true);
        const random = RandomHelper_1.default.getRandomInt(0, bound);
        await interaction.reply(`** ${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.rollReply).replace('RANDOM', random.toString())} ** `);
    }
}
exports.default = {
    data: new Roll()
};
//# sourceMappingURL=Roll.js.map