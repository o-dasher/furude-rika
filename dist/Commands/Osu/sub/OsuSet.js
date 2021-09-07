"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BotEmbed_1 = __importDefault(require("@discord-classes/Embed/BotEmbed"));
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
const OsuServerOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption"));
const OsuUserOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption"));
const SubCommandABC_1 = __importDefault(require("@furude-commands/SubCommandABC"));
const DBManager_1 = __importDefault(require("@furude-db/DBManager"));
const DBPaths_1 = __importDefault(require("@furude-db/DBPaths"));
const DBUserHelper_1 = __importDefault(require("@furude-db/DBUserHelper"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
class OsuSet extends SubCommandABC_1.default {
    defaultServerOption = 'default-server';
    constructor() {
        super();
        this.setName('set').setDescription('Set your osu! related things with this command.');
        this.addStringOption(new OsuUserOption_1.default().setDescription('Your new user for the choosen server.'));
        this.addStringOption(new OsuServerOption_1.default().setDescription('The server to register your new user, defaults to your prefered server.'));
        this.addStringOption(new OsuServerOption_1.default()
            .setName(this.defaultServerOption)
            .setDescription('Your prefered server, defaults to bancho.'));
    }
    async run(interaction) {
        await interaction.deferReply();
        const userData = await DBManager_1.default.getUserData(interaction.user);
        let server = OsuServerOption_1.default.getTag(interaction, userData);
        if (interaction.options.getString(this.defaultServerOption)) {
            server = OsuServerOption_1.default.getTagFromString(interaction, this.defaultServerOption, userData);
            userData.osu.defaultServer = server.name;
        }
        if (interaction.options.getString(OptionsTags_1.default.osuUser)) {
            const user = await OsuUserOption_1.default.getTag(interaction, server, userData);
            DBUserHelper_1.default.changeUserName(user, userData, server);
        }
        await DBManager_1.default.furudeDB
            .collection(DBPaths_1.default.users)
            .doc(interaction.user.id)
            .set(userData, { merge: true });
        const embed = new BotEmbed_1.default(interaction)
            .setTitle(Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.osuSetTitle))
            .setDescription(`>>> **Default Server: ${userData.osu.defaultServer}\nBancho: ${userData.osu.bancho}\nDroid: ${userData.osu.droid}**`);
        await interaction.editReply({ embeds: [embed] });
    }
}
exports.default = OsuSet;
//# sourceMappingURL=OsuSet.js.map