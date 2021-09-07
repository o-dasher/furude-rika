"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBManager_1 = __importDefault(require("@furude-db/DBManager"));
const OsuServerOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption"));
const OsuUserOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption"));
const UserOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/UserOption"));
const SubCommandABC_1 = __importDefault(require("@furude-commands/SubCommandABC"));
class OsuGameCommand extends SubCommandABC_1.default {
    constructor() {
        super();
        this.addStringOption(new OsuUserOption_1.default());
        this.addUserOption(new UserOption_1.default());
        this.addStringOption(new OsuServerOption_1.default());
    }
    async getOsuParams(interaction) {
        let error = false;
        const runnerData = await DBManager_1.default.getUserData(interaction.user);
        const server = OsuServerOption_1.default.getTag(interaction, runnerData);
        const discordUser = UserOption_1.default.getTag(interaction);
        let pickedUserData = discordUser
            ? await DBManager_1.default.getUserData(discordUser)
            : runnerData;
        const osuUser = await OsuUserOption_1.default.getTag(interaction, server, pickedUserData);
        error = !osuUser;
        return {
            osuUser,
            server,
            error
        };
    }
}
exports.default = OsuGameCommand;
//# sourceMappingURL=OsuGameCommand.js.map