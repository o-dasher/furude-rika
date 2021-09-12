// SEE: https://github.com/Rian8337/Alice/blob/master/src/utils/helpers/DPPHelper.ts

import ApiManager from '@furude-osu/API/ApiManager';
import DroidServer from '@furude-osu/Servers/DroidServer';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuServers from '@furude-osu/Servers/OsuServers';
import OwnedAPIBeatmap from '@furude-osu/Users/beatmaps/OwnedAPIBeatmap';
import OsuScore from '@furude-osu/Users/score/OsuScore';
import MapUtils from '@furude-osu/Utils/MapUtils';
import ModUtils from '@furude-osu/Utils/ModUtils';
import consolaGlobalInstance from 'consola';
import {
  Parser,
  DroidPerformanceCalculator,
  OsuPerformanceCalculator,
  Accuracy,
  DroidStarRating,
  OsuStarRating
} from 'osu-droid';
import PPEntry from './PPEntry';

abstract class PPHelper {
  private constructor() {}

  /**
   * Calculates the final performance points from a list of pp entries.
   *
   * @param list The list.
   * @returns The final performance points.
   */
  public static calculateFinalPerformancePoints(list: PPEntry[]): number {
    list.sort((a, b) => {
      return b.pp - a.pp;
    });

    return [...list.values()].reduce(
      (a, v, i) => a + v.pp * Math.pow(0.95, i),
      0
    );
  }

  public static async calculateScore(
    score: OsuScore,
    server: OsuServer
  ): Promise<OsuScore> {
    const osuParser = new Parser();
    const calculator =
      server === OsuServers.droid
        ? new DroidPerformanceCalculator()
        : new OsuPerformanceCalculator();

    try {
      if (server === OsuServers.droid) {
        let newBeatmap = new OwnedAPIBeatmap();
        Object.assign(newBeatmap, score.beatmap);
        Object.assign(
          newBeatmap,
          (
            await ApiManager.banchoApi.getBeatmaps({
              h: newBeatmap.hash
            })
          )[0]
        );
        score.beatmap = newBeatmap;
      }
    } catch (err) {
      consolaGlobalInstance.error(err);
      score.beatmap.exists = false;
    }

    if (server === OsuServers.droid) {
      const modString = [score.mods].join();
      score.processedMods = ModUtils.pcStringToMods(modString);
    } else {
      score.processedMods = ModUtils.pcModbitsToMods(
        parseInt(score.mods.toString())
      );
    }

    if (score.beatmap.exists) {
      const osu = await MapUtils.getBeatmapOsu(score.beatmap.id);
      const map = osuParser.parse(osu, score.processedMods).map;
      const stars = calculator.stars.calculate({
        map,
        mods: score.processedMods
      });

      const accuracy = new Accuracy(
        server === OsuServers.droid
          ? {
              nobjects: map.objects.length,
              percent: score.accuracy,
              nmiss: score.counts.miss
            }
          : {
              nobjects: map.objects.length,
              n300: score.counts[300],
              n100: score.counts[100],
              n50: score.counts[50],
              nmiss: score.counts.miss
            }
      );

      if (
        stars instanceof DroidStarRating &&
        calculator instanceof DroidPerformanceCalculator
      ) {
        calculator.calculate({
          stars,
          combo: score.maxCombo,
          accPercent: accuracy,
          miss: score.counts.miss
        });
      } else if (
        stars instanceof OsuStarRating &&
        calculator instanceof OsuPerformanceCalculator
      ) {
        calculator.calculate({
          stars,
          combo: score.maxCombo,
          accPercent: accuracy,
          miss: score.counts.miss
        });
      }
    }

    score.calcs = calculator;
    score.pp = calculator.total;
    score.counts[300] = calculator.computedAccuracy.n300;
    score.counts[100] = calculator.computedAccuracy.n100;
    score.counts[50] = calculator.computedAccuracy.n50;

    return score;
  }
}

export default PPHelper;
