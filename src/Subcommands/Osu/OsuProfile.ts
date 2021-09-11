import { CommandInteraction } from 'discord.js';
import OsuGameCommand from '@furude-subs/Osu/Utils/OsuGameCommand';
import BotEmbed from '@discord-classes/Embed/BotEmbed';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import Droid from '@furude-osu/Servers/Droid';
import StringUtils from '@furude-utils/StringUtils';

class OsuProfile extends OsuGameCommand {
  public constructor() {
    super();
    this.setName('profile').setDescription(
      "Views yours or someone's osu! profile"
    );
  }
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const { osuUser, server, error } = await this.getOsuParams(interaction);

    if (error) {
      return;
    }

    let performanceInfo = '';

    if (osuUser?.pp) {
      performanceInfo = performanceInfo.concat(
        `PP: ${Math.round(osuUser!.pp!.raw?.valueOf() ?? 0)}\n`
      );
    }
    performanceInfo = performanceInfo.concat(`Rank: #${osuUser!.pp!.rank} `);
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(
        ` (#${osuUser!.pp!.countryRank})`
      );
    }
    performanceInfo = performanceInfo.concat(
      `\nAccuracy: ${osuUser!.accuracyFormatted}\nPlayCount: ${
        osuUser!.counts!.plays
      }`
    );
    if (interaction.guild) {
      performanceInfo = performanceInfo.concat(
        `\nTotal Score: ${Localizer.localizeNumber(
          interaction,
          osuUser?.scores!.total!
        )}\nRanked Score: ${Localizer.localizeNumber(
          interaction,
          osuUser?.scores!.ranked!
        )}`
      );
    }
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(
        `\nLevel: ${osuUser!.level!.toFixed(2)}`
      );
    }

    const embed = new BotEmbed(interaction)
      .setDescription(
        StringUtils.boldString(
          `[${Localizer.getLocaleString(
            interaction,
            LocalizeTags.osuProfileTitle
          ).replace('USER', osuUser!.name!)}](${osuUser!.profileUrl})`
        )
      )
      .addField(
        '---Perfomance',
        StringUtils.blockQuote(StringUtils.boldString(performanceInfo)),
        true
      )
      .setThumbnail(osuUser!.avatarUrl!);

    if (!(server instanceof Droid)) {
      embed.addField(
        '---Counts',
        StringUtils.blockQuote(
          StringUtils.boldString(
            `SSH: ${osuUser!.counts!.SSH}\nSS: ${osuUser!.counts!.SS}\nSH: ${
              osuUser!.counts!.SH
            }\nS: ${osuUser!.counts!.S}\nA: ${osuUser!.counts!.A}`
          )
        ),
        true
      );
    }

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default OsuProfile;
