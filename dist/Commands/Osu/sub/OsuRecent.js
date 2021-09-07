"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BotEmbed_1 = __importDefault(require("@discord-classes/Embed/BotEmbed"));
const IndexOption_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/IndexOption"));
const ModUtils_1 = __importDefault(require("@furude-osu/Utils/ModUtils"));
const OsuWithCalcCommand_1 = __importDefault(require("@furude-commands/Osu/Sub/Utils/OsuWithCalcCommand"));
class OsuRecent extends OsuWithCalcCommand_1.default {
    constructor() {
        super();
        this.setName('recent').setDescription('Gets your recent osu! scores');
        this.addNumberOption(new IndexOption_1.default().setDescription('The play index'));
    }
    async run(interaction) {
        await interaction.deferReply();
        const index = IndexOption_1.default.getTag(interaction);
        const { server, osuUser, scores, error, indexFrom } = await this.getScores(interaction, index, 0);
        if (error) {
            return;
        }
        const score = scores[indexFrom];
        const modstr = ModUtils_1.default.getStringRepr(score.processedMods);
        let info = `Score: ${score.score.toLocaleString(interaction.guild.preferredLocale)}\nAccuracy: ${score.accuracy}%\nMiss: ${score.counts.miss}\nCombo: ${score.maxCombo}`;
        if (score.beatmap.exists) {
            info = info.concat(` / ${score.beatmap.maxCombo}`);
        }
        if (score.beatmap.exists && score.calcs) {
            info = info.concat(`\nPP: ${score.calcs?.total.toFixed(2)}`);
        }
        let title = `${score.beatmap.title} - [${score.beatmap.version}] +${modstr}`;
        if (score.beatmap.exists && score.calcs) {
            title = title.concat(` [${score.calcs.stars.total.toFixed(2)}★]`);
        }
        const embed = new BotEmbed_1.default(interaction)
            .setTitle(`**${title}**`)
            .setDescription(`**${info}**`)
            .setThumbnail(`https://b.ppy.sh/thumb/${score.beatmap.beatmapSetId}l.jpg`);
        await interaction.editReply({
            embeds: [embed],
            content: `**${indexFrom + 1}th Recent play from ${osuUser?.name} on ${server.name} servers**`
        });
    }
}
exports.default = OsuRecent;
//# sourceMappingURL=OsuRecent.js.map