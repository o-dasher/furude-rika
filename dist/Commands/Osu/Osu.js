"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandABC_1 = __importDefault(require("@furude-commands/CommandABC"));
const OsuProfile_1 = __importDefault(require("@furude-commands/Osu/Sub/OsuProfile"));
const OsuRecent_1 = __importDefault(require("@furude-commands/Osu/Sub/OsuRecent"));
const OsuSet_1 = __importDefault(require("@furude-commands/Osu/Sub/OsuSet"));
class Osu extends CommandABC_1.default {
    constructor() {
        super();
        this.setName('osu').setDescription('osu! related commands...');
        this.addSelfSubcommand(new OsuSet_1.default());
        this.addSelfSubcommand(new OsuProfile_1.default());
        this.addSelfSubcommand(new OsuRecent_1.default());
    }
    async run(interaction) {
        const subCommandString = interaction.options.getSubcommand(true);
        this.getSubcommand(subCommandString).run(interaction);
    }
}
exports.default = {
    data: new Osu()
};
//# sourceMappingURL=Osu.js.map