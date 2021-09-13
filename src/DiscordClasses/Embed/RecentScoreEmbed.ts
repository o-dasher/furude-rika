import Localizer from '@furude-localization/Localizer';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuScore from '@furude-osu/Users/score/OsuScore';
import MapUtils from '@furude-osu/Utils/MapUtils';
import ModUtils from '@furude-osu/Utils/ModUtils';
import StringUtils from '@furude-utils/StringUtils';
import {
  CommandInteraction,
  MessageEmbed,
  MessageEmbedOptions
} from 'discord.js';
import BotEmbed from './BotEmbed';

class RecentScoreEmbed extends BotEmbed {
  public constructor(
    score: OsuScore,
    server: OsuServer,
    interaction?: CommandInteraction | undefined,
    data?: MessageEmbed | MessageEmbedOptions
  ) {
    super(interaction, data);

    const modstr = ModUtils.getStringRepr(score.processedMods);
    const { pp, beatmap, counts } = score;

    const info = `▸ ${StringUtils.boldString(`${pp.toFixed(2)}PP`)} ▸ ${
      score.accuracy
    }%\n▸ ${Localizer.localizeNumber(score.score, interaction)} ▸ x${
      score.maxCombo
    }${beatmap.exists ? `/${beatmap.maxCombo}` : ''} ▸ [${counts[300]}/${
      counts[100]
    }/${counts[50]}/${counts.miss}]`;

    let title = `${beatmap.artist} - ${beatmap.title} (${beatmap.creator}) [${
      beatmap.version
    }] ${modstr} ${
      score.calcs ? `[${score.calcs.stars.total.toFixed(2)}★]` : ''
    }`;

    score.date = score.date as Date;

    this.setTitle(StringUtils.boldString(title))
      .setDescription(info)
      .setThumbnail(MapUtils.getThumbnailUrl(score.beatmap.beatmapSetId))
      .setURL(MapUtils.getBeatmapPageUrl(score.beatmap))
      .setFooter('Score was achieved', server.iconURL)
      .setTimestamp(score.date);
  }
}

export default RecentScoreEmbed;
