"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BotEmbed_1 = __importDefault(require("@discord-classes/Embed/BotEmbed"));
const InteractionHelper_1 = __importDefault(require("@discord-classes/Interactions/InteractionHelper"));
const UserOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/UserOption"));
const CommandABC_1 = __importDefault(require("@furude-commands/CommandABC"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
class Avatar extends CommandABC_1.default {
    constructor() {
        super();
        this.setName('avatar').setDescription('Get yours or another user avatar.');
        this.addUserOption(new UserOption_1.default().setDescription('The user which you want to get the avatar from.'));
    }
    async run(interaction) {
        await interaction.deferReply();
        const user = InteractionHelper_1.default.defaultOptionalUser(interaction);
        const embed = new BotEmbed_1.default(interaction)
            .setTitle(Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.avatarTitle))
            .setDescription(` ** 
        ${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.avatarDescription).replace('USER', `[${user}](${user.avatarURL()})`)}
        ** `);
        const avatar = user.avatarURL({ dynamic: true, size: 1024 });
        if (avatar) {
            embed.setImage(avatar);
        }
        await interaction.editReply({
            embeds: [embed]
        });
    }
}
exports.default = {
    data: new Avatar()
};
//# sourceMappingURL=Avatar.js.map