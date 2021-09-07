"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const OsuServers_1 = __importDefault(require("@furude-osu/Servers/OsuServers"));
const OptionHelper_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionHelper"));
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
class OsuServerOption extends builders_1.SlashCommandStringOption {
    tag = OptionsTags_1.default.osuServer;
    constructor() {
        super();
        OptionHelper_1.default.build(this).setDescription('Your preffered osu! server');
    }
    static getTag(interaction, userData) {
        return this.getTagFromString(interaction, OptionsTags_1.default.osuServer, userData);
    }
    static getTagFromString(interaction, tag, userData) {
        const serverString = interaction.options.getString(tag);
        return serverString
            ? OsuServers_1.default.getFromString(serverString)
            : OsuServers_1.default.getFromString(userData.osu.defaultServer);
    }
}
exports.default = OsuServerOption;
//# sourceMappingURL=OsuServerOption.js.map