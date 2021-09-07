"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const consola_1 = __importDefault(require("consola"));
class FurudeRika extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    constructor() {
        super({
            intents: [discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILDS]
        });
    }
    logLogin(client) {
        consola_1.default.success(client.user.username + ' logged succesfully!');
    }
    start() {
        this.login(process.env.BOT_TOKEN);
        this.once('ready', (client) => {
            this.logLogin(client);
        });
        this.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) {
                return;
            }
            const command = this.commands.get(interaction.commandName);
            if (!command) {
                return;
            }
            command.run(interaction);
        });
        process.on('unhandledRejection', (err) => {
            consola_1.default.error(err);
            consola_1.default.success('Reseting from previous Exception');
            this.login(process.env.BOT_TOKEN);
            this.logLogin(this);
        });
    }
}
exports.default = FurudeRika;
//# sourceMappingURL=FurudeRika.js.map