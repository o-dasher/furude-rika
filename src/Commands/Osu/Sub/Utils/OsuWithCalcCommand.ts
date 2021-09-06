import axios from 'axios';
import consolaGlobalInstance from 'consola';
import { CommandInteraction } from 'discord.js';
import {
  DroidPerformanceCalculator,
  DroidStarRating,
  Mod,
  OsuPerformanceCalculator,
  OsuStarRating,
  Parser
} from 'osu-droid';
import ApiManager from '../../../../Osu!/API/ApiManager';
import Droid from '../../../../Osu!/Servers/Droid';
import OwnedAPIBeatmap from '../../../../Osu!/Users/beatmaps/OwnedAPIBeatmap';
import AbstractScore from '../../../../Osu!/Users/score/AbstractScore';
import ModUtils from '../../../../Osu!/Utils/ModUtils';
import IOSuWithCalc from './IOsuWithCalc';
import OsuGameCommand from './OsuGameCommand';

abstract class OsuWithCalcCommand extends OsuGameCommand {
  override async getOsuParams(
    interaction: CommandInteraction
  ): Promise<IOSuWithCalc> {
    const params = await super.getOsuParams(interaction);

    const { osuUser, server } = params;
    let { error } = params;
    let mods: Mod[] = [];

    const osuParser = new Parser();
    const calculator =
      server instanceof Droid
        ? new DroidPerformanceCalculator()
        : new OsuPerformanceCalculator();

    let score = null;
    let scores: AbstractScore[] = [];
    let mapExists = false;
    let apiBeatmap: OwnedAPIBeatmap | null = null;

    if (osuUser) {
      try {
        scores = await osuUser.getScores();
      } catch (err) {
        error = true;
        consolaGlobalInstance.error(err);
      }

      const hasRecent = scores.length !== 0;

      if (!hasRecent) {
        await interaction.editReply(
          `**${osuUser.name} doesn't have any recent plays!**`
        );
        error = true;
      }

      if (!error) {
        score = scores[0];

        try {
          apiBeatmap =
            server instanceof Droid
              ? (
                  await ApiManager.banchoApi.getBeatmaps({
                    h: score.beatmap.hash
                  })
                )[0]
              : score.beatmap;
          mapExists = true;
        } catch (err) {
          apiBeatmap = score.beatmap;
        }

        if (server instanceof Droid) {
          const modString = [score.mods].join();
          mods = ModUtils.pcStringToMods(modString);
        } else {
          mods = mods.concat(
            ModUtils.pcModbitsToMods(parseInt(score.mods.toString()))
          );
        }

        if (mapExists) {
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
      }
    }

    return {
      osuUser,
      server,
      calculator,
      osuParser,
      score,
      error,
      apiBeatmap,
      mapExists,
      mods
    };
  }
}

export default OsuWithCalcCommand;
