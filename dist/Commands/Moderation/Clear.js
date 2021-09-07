"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AmountOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/AmountOption"));
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
const CommandABC_1 = __importDefault(require("@furude-commands/CommandABC"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
const discord_js_1 = require("discord.js");
class Clear extends CommandABC_1.default {
    constructor() {
        super();
        this.setName('clear').setDescription('Clear messages in a certain channel');
        this.addNumberOption(new AmountOption_1.default().setDescription('Amount of messages to be cleared.'));
    }
    async run(interaction) {
        if (!interaction.member ||
            !(interaction.member.permissions instanceof discord_js_1.Permissions) ||
            !interaction.member.permissions.has(discord_js_1.Permissions.FLAGS.MANAGE_MESSAGES) ||
            !(interaction.channel instanceof discord_js_1.TextChannel)) {
            return;
        }
        const amount = interaction.options.getNumber(OptionsTags_1.default.amount, true);
        await interaction.channel.bulkDelete(amount, true);
        const reply = await interaction.reply({
            content: `** ${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.clearReply).replace('AMOUNT', amount.toString())} **`,
            fetchReply: true
        });
        setTimeout(async () => {
            if (!interaction.channel) {
                return;
            }
            const message = await interaction.channel.messages.fetch(reply.id);
            if (message.deletable) {
                await message.delete();
            }
        }, 2500);
    }
}
exports.default = {
    data: new Clear()
};
//# sourceMappingURL=Clear.js.map