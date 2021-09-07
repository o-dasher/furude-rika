"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OsuGameCommand_1 = __importDefault(require("@furude-commands/Osu/Sub/Utils/OsuGameCommand"));
const BotEmbed_1 = __importDefault(require("@discord-classes/Embed/BotEmbed"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const LocalizeTags_1 = __importDefault(require("@furude-localization/LocalizeTags"));
const Droid_1 = __importDefault(require("@furude-osu/Servers/Droid"));
class OsuProfile extends OsuGameCommand_1.default {
    constructor() {
        super();
        this.setName('profile').setDescription("Views yours or someone's osu! profile");
    }
    async run(interaction) {
        await interaction.deferReply();
        const { osuUser, server, error } = await this.getOsuParams(interaction);
        if (error) {
            return;
        }
        let performanceInfo = '>>> **';
        if (!(server instanceof Droid_1.default)) {
            performanceInfo = performanceInfo.concat(`PP: ${osuUser.pp.raw}\n`);
        }
        performanceInfo = performanceInfo.concat(`Rank: #${osuUser.pp.rank} `);
        if (!(server instanceof Droid_1.default)) {
            performanceInfo = performanceInfo.concat(` (#${osuUser.pp.countryRank})`);
        }
        performanceInfo = performanceInfo.concat(`\nAccuracy: ${osuUser.accuracyFormatted}\nPlayCount: ${osuUser.counts.plays}`);
        if (interaction.guild) {
            performanceInfo = performanceInfo.concat(`\nTotal Score: ${osuUser.scores.total.toLocaleString(interaction.guild.preferredLocale)}\nRanked Score: ${osuUser.scores.ranked.toLocaleString(interaction.guild.preferredLocale)}`);
        }
        if (!(server instanceof Droid_1.default)) {
            performanceInfo = performanceInfo.concat(`\nLevel: ${osuUser.level.toFixed(2)}`);
        }
        performanceInfo = performanceInfo.concat('**');
        const embed = new BotEmbed_1.default(interaction)
            .setDescription(`**[${Localizer_1.default.getLocaleString(interaction, LocalizeTags_1.default.osuProfileTitle).replace('USER', osuUser.name)}](${osuUser.profileUrl})**`)
            .addField('---Perfomance', performanceInfo, true)
            .setThumbnail(osuUser.avatarUrl);
        if (!(server instanceof Droid_1.default)) {
            embed.addField('---Counts', `>>> **SSH: ${osuUser.counts.SSH}\nSS: ${osuUser.counts.SS}\nSH: ${osuUser.counts.SH}\nS: ${osuUser.counts.S}\nA: ${osuUser.counts.A}**`, true);
        }
        await interaction.editReply({
            embeds: [embed]
        });
    }
}
exports.default = OsuProfile;
//# sourceMappingURL=OsuProfile.js.map