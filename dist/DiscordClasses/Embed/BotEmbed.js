"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class BotEmbed extends discord_js_1.MessageEmbed {
    constructor(interaction, data) {
        super(data);
        if (interaction.guild && interaction.guild.me) {
            this.setColor(interaction.guild.me.displayColor);
        }
    }
}
exports.default = BotEmbed;
//# sourceMappingURL=BotEmbed.js.map