import axios from 'axios';
import consolaGlobalInstance from 'consola';
import { CommandInteraction } from 'discord.js';
import {
  DroidPerformanceCalculator,
  DroidStarRating,
  Mod,
  OsuPerformanceCalculator,
  OsuStarRating
} from 'osu-droid';

import BotEmbed from '../../../DiscordClasses/Embed/BotEmbed';
import ApiManager from '../../../Osu!/API/ApiManager';
import Droid from '../../../Osu!/Servers/Droid';
import OwnedAPIBeatmap from '../../../Osu!/Users/beatmaps/OwnedAPIBeatmap';
import AbstractScore from '../../../Osu!/Users/score/AbstractScore';
import ModUtils from '../../../Osu!/Utils/ModUtils';
import OsuWithCalcCommand from './Utils/OsuWithCalcCommand';

class OsuRecent extends OsuWithCalcCommand {
  public constructor() {
    super();
    this.setName('recent').setDescription('Gets your recent osu! scores');
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const { osuUser, server, calculator, osuParser } = await this.getOsuParams(
      interaction
    );

    if (!osuUser) {
      return;
    }

    let scores: AbstractScore[] = [];

    try {
      scores = await osuUser.getScores();
    } catch (err) {
      consolaGlobalInstance.error(err);
    }

    const hasRecent = scores.length !== 0;

    if (!hasRecent) {
      await interaction.editReply(
        `**${osuUser.name} doesn't have any recent plays!**`
      );
      return;
    }

    const score = scores[0];
    let beatmapExists = false;

    let apiBeatmap: OwnedAPIBeatmap | null = null;
    try {
      apiBeatmap =
        server instanceof Droid
          ? (
              await ApiManager.banchoApi.getBeatmaps({ h: score.beatmap.hash })
            )[0]
          : score.beatmap;
      beatmapExists = true;
    } catch (err) {
      apiBeatmap = score.beatmap;
    }

    let mods: Mod[] | null = null;

    if (server instanceof Droid) {
      const modString = [score.mods].join();
      mods = ModUtils.pcStringToMods(modString);
    } else {
      mods = ModUtils.pcModbitsToMods(parseInt(score.mods.toString()));
    }

    if (beatmapExists) {
      const mapDownloadUrl = `https://osu.ppy.sh/osu/${apiBeatmap.id}`;
      const osu = await axios.get(mapDownloadUrl);
      const map = osuParser.parse(osu.data, mods).map;
      const stars = calculator.stars.calculate({ map, mods });

      if (
        stars instanceof DroidStarRating &&
        calculator instanceof DroidPerformanceCalculator
      ) {
        calculator.calculate({
          stars,
          combo: score.maxCombo,
          accPercent: score.accuracy,
          miss: score.counts.miss
        });
      } else if (
        stars instanceof OsuStarRating &&
        calculator instanceof OsuPerformanceCalculator
      ) {
        calculator.calculate({
          stars,
          combo: score.maxCombo,
          accPercent: score.accuracy,
          miss: score.counts.miss
        });
      }
    }

    const modstr = ModUtils.getStringRepr(mods);

    let info = `**Score: ${score.score.toLocaleString(
      interaction.guild!.preferredLocale
    )}\nAccuracy: ${score.accuracy}%\nCombo: ${score.maxCombo} / ${
      apiBeatmap.maxCombo
    }}`;
    if (beatmapExists) {
      info = info.concat(`\nPP: ${calculator.total.toFixed(2)}`);
    }
    info = info.concat('**');

    const embed = new BotEmbed(interaction)
      .setTitle(`${apiBeatmap.title} - [${apiBeatmap.version}] +${modstr}`)
      .setDescription(info)
      .setThumbnail(`https://b.ppy.sh/thumb/${apiBeatmap.beatmapSetId}l.jpg`);

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default OsuRecent;
