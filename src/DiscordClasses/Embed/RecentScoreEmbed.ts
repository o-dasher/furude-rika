import Localizer from '@furude-localization/Localizer';
import OsuScore from '@furude-osu/Users/score/OsuScore';
import MapUtils from '@furude-osu/Utils/MapUtils';
import ModUtils from '@furude-osu/Utils/ModUtils';
import StringUtils from '@furude-utils/StringUtils';
import {
  ColorResolvable,
  CommandInteraction,
  MessageEmbed,
  MessageEmbedOptions
} from 'discord.js';
import BotEmbed from './BotEmbed';

class RecentScoreEmbed extends BotEmbed {
  public constructor(
    score: OsuScore,
    interaction?: CommandInteraction | null,
    data?: MessageEmbed | MessageEmbedOptions
  ) {
    super(interaction, data);

    const modstr = ModUtils.getStringRepr(score.processedMods);

    let info = `Score: ${Localizer.localizeNumber(
      score.score,
      interaction ?? undefined
    )}\nAccuracy: ${score!.accuracy}%\nMiss: ${score.counts.miss}\nCombo: ${
      score!.maxCombo
    }`;
    if (score.beatmap.exists) {
      info = info.concat(` / ${score.beatmap.maxCombo}`);
    }
    if (score.beatmap.exists && score.calcs) {
      info = info.concat(`\nPP: ${score.calcs?.total.toFixed(2)}`);
    }

    let title = `${score.beatmap.title} - [${score.beatmap.version}] ${modstr}`;
    if (score.beatmap.exists && score.calcs) {
      title = title.concat(` [${score.calcs.stars.total.toFixed(2)}★]`);
    }

    this.setTitle(StringUtils.boldString(title))
      .setDescription(StringUtils.boldString(info))
      .setThumbnail(MapUtils.getThumbnailUrl(score.beatmap.beatmapSetId));
  }
}

export default RecentScoreEmbed;
