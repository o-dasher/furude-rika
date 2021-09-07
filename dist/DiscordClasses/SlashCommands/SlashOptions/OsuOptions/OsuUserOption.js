"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const DBUserHelper_1 = __importDefault(require("@furude-db/DBUserHelper"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
const Bancho_1 = __importDefault(require("@furude-osu/Servers/Bancho"));
const Droid_1 = __importDefault(require("@furude-osu/Servers/Droid"));
const BanchoUser_1 = __importDefault(require("@furude-osu/Users/BanchoUser"));
const OsuDroidUser_1 = __importDefault(require("@furude-osu/Users/OsuDroidUser"));
const OsuUserHelper_1 = __importDefault(require("@furude-osu/Users/OsuUserHelper"));
const OptionHelper_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionHelper"));
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
class OsuUserOption extends builders_1.SlashCommandStringOption {
    tag = OptionsTags_1.default.osuUser;
    constructor() {
        super();
        OptionHelper_1.default.build(this).setDescription('The choosen osu! user');
    }
    static async getTag(interaction, server, userData) {
        let osuUser = null;
        let usernameOrID = interaction.options.getString(OptionsTags_1.default.osuUser);
        if (!usernameOrID) {
            usernameOrID = DBUserHelper_1.default.getUserName(userData, server);
        }
        if (server instanceof Bancho_1.default) {
            try {
                osuUser = await new BanchoUser_1.default().buildUser(usernameOrID);
            }
            catch (err) { }
        }
        else if (server instanceof Droid_1.default) {
            const id = parseInt(usernameOrID);
            if (!id) {
                await interaction.editReply(`**${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.droidUserMustBeID)}**`);
                return;
            }
            else {
                osuUser = await new OsuDroidUser_1.default().buildUser(usernameOrID);
            }
        }
        if (!osuUser || !OsuUserHelper_1.default.userExists(osuUser)) {
            osuUser = null;
            await interaction.editReply(`**${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.osuUserFetchError)
                .replace('USER', usernameOrID)
                .replace('SERVER', server.name)}**`);
            return;
        }
        return osuUser;
    }
}
exports.default = OsuUserOption;
//# sourceMappingURL=OsuUserOption.js.map