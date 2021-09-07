"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandABC_1 = __importDefault(require("@furude-commands/CommandABC"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
class Ping extends CommandABC_1.default {
    constructor() {
        super();
        this.setName('ping').setDescription('Replies with pong!');
    }
    async run(interaction) {
        await interaction.deferReply();
        await interaction.editReply(` ** ${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.pingReply)
            .replace('PINGMS', (Date.now() - interaction.createdTimestamp).toString())
            .replace('PINGAPIMS', Math.round(interaction.client.ws.ping).toString())} ** `);
    }
}
exports.default = {
    data: new Ping()
};
//# sourceMappingURL=Ping.js.map