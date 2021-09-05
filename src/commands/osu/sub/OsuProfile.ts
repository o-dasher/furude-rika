import { CommandInteraction } from 'discord.js';
import BotEmbed from '../../../DiscordClasses/Embed/BotEmbed';
import Localizer from '../../../Localization/Localizer';
import LocalizeTags from '../../../Localization/LocalizeTags';
import Droid from '../../../Osu!/Servers/Droid';
import OsuGameCommand from './Utils/OsuGameCommand';

class OsuProfile extends OsuGameCommand {
  public constructor() {
    super();
    this.setName('profile').setDescription(
      "Views yours or someone's osu! profile"
    );
  }
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const { osuUser, server } = await this.getOsuParams(interaction);

    if (osuUser == null) {
      return;
    }

    let performanceInfo = '>>> **';
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(`PP: ${osuUser.pp.raw}\n`);
    }
    performanceInfo = performanceInfo.concat(`Rank: #${osuUser.pp.rank} `);
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(` (#${osuUser.pp.countryRank})`);
    }
    performanceInfo = performanceInfo.concat(
      `\nAccuracy: ${osuUser.accuracyFormatted}\nPlayCount: ${
        osuUser.counts.plays
      }\nTotal Score: ${osuUser.scores.total.toLocaleString(
        interaction.guild.preferredLocale
      )}\nRanked Score: ${osuUser.scores.ranked.toLocaleString(
        interaction.guild.preferredLocale
      )}`
    );
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(
        `\nLevel: ${osuUser.level.toFixed(2)}`
      );
    }
    performanceInfo = performanceInfo.concat('**');

    const embed = new BotEmbed(interaction)
      .setDescription(
        `**[${Localizer.getLocaleString(
          interaction,
          LocalizeTags.osuProfileTitle
        ).replace('USER', osuUser.name)}](${osuUser.profileUrl})**`
      )
      .addField('---Perfomance', performanceInfo, true)
      .setThumbnail(osuUser.avatarUrl);

    if (!(server instanceof Droid)) {
      embed.addField(
        '---Counts',
        `>>> **SSH: ${osuUser.counts.SSH}\nSS: ${osuUser.counts.SS}\nA: ${osuUser.counts.A}**`,
        true
      );
    }

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default OsuProfile;
