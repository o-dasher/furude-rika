import { CommandInteraction } from 'discord.js';

import BotEmbed from '@discord-classes/Embed/BotEmbed';
import IndexOption from '@discord-classes/SlashCommands/SlashOptions/IndexOption';
import ModUtils from '@furude-osu/Utils/ModUtils';
import OsuWithCalcCommand from '@furude-subs/Osu/Utils/OsuWithCalcCommand';
import Localizer from '@furude-localization/Localizer';
import ordinal from 'ordinal';
import StringUtils from '@furude-utils/StringUtils';
import MapUtils from '@furude-osu/Utils/MapUtils';

class OsuRecent extends OsuWithCalcCommand {
  public constructor() {
    super();
    this.setName('recent').setDescription('Gets your recent osu! scores');
    this.addNumberOption(new IndexOption().setDescription('The play index'));
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const index = IndexOption.getTag(interaction);
    const { server, osuUser, scores, error, indexFrom } = await this.getScores(
      interaction,
      index,
      0
    );

    if (error) {
      return;
    }

    const score = scores![indexFrom];
    const modstr = ModUtils.getStringRepr(score.processedMods);

    let info = `Score: ${Localizer.localizeNumber(
      interaction,
      score.score
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

    const embed = new BotEmbed(interaction)
      .setTitle(StringUtils.boldString(title))
      .setDescription(StringUtils.boldString(info))
      .setThumbnail(MapUtils.getThumbnailUrl(score.beatmap.beatmapSetId));

    await interaction.editReply({
      embeds: [embed],
      content: StringUtils.successString(
        `${ordinal(indexFrom + 1)} Recent play from ${osuUser?.name} on ${
          server.name
        } servers`
      )
    });
  }
}

export default OsuRecent;
