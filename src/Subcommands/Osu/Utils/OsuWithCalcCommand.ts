import axios from 'axios';
import consolaGlobalInstance from 'consola';
import { CommandInteraction } from 'discord.js';
import {
  Accuracy,
  DroidPerformanceCalculator,
  DroidStarRating,
  OsuPerformanceCalculator,
  OsuStarRating,
  Parser
} from 'osu-droid';
import ApiManager from '@furude-osu/API/ApiManager';
import Droid from '@furude-osu/Servers/Droid';
import OwnedAPIBeatmap from '@furude-osu/Users/beatmaps/OwnedAPIBeatmap';
import OsuScore from '@furude-osu/Users/score/OsuScore';
import ModUtils from '@furude-osu/Utils/ModUtils';
import IOSuWithCalc from '@furude-subs/Osu/Utils/IOsuWithCalc';
import OsuGameCommand from '@furude-subs/Osu/Utils/OsuGameCommand';
import StringUtils from '@furude-utils/StringUtils';
import MapUtils from '@furude-osu/Utils/MapUtils';

abstract class OsuWithCalcCommand extends OsuGameCommand {
  async getScores(
    interaction: CommandInteraction,
    indexFrom: number,
    indexTo: number
  ): Promise<IOSuWithCalc> {
    const params = await super.getOsuParams(interaction);

    const { osuUser, server, userData } = params;
    let { error } = params;

    const osuParser = new Parser();
    const calculator =
      server instanceof Droid
        ? new DroidPerformanceCalculator()
        : new OsuPerformanceCalculator();

    let scores: OsuScore[] = [];

    if (osuUser) {
      try {
        scores = await osuUser.getScores({ limit: indexTo + 1 });
      } catch (err) {
        error = true;
        consolaGlobalInstance.error(err);
      }

      const hasRecent = scores.length !== 0;

      if (!hasRecent) {
        await interaction.editReply(
          StringUtils.boldString(
            `${osuUser.name} doesn't have any recent plays!`
          )
        );
        error = true;
      }

      if (!error) {
        indexFrom = Math.max(0, Math.min(indexFrom, scores.length - 1));
        indexTo = indexFrom + indexTo + 1;
        for (let i = 0; i < indexTo; i++) {
          if (i < indexFrom) {
            continue;
          }

          const score = scores[i];

          try {
            if (server instanceof Droid) {
              let newBeatmap = new OwnedAPIBeatmap();
              Object.assign(
                newBeatmap,
                (
                  await ApiManager.banchoApi.getBeatmaps({
                    h: score.beatmap.hash
                  })
                )[0]
              );
              score.beatmap = newBeatmap;
            }
          } catch (err) {
            consolaGlobalInstance.error(
              `Map: ${score.beatmap.hash}  not found!`
            );
            score.beatmap.exists = false;
          }

          if (server instanceof Droid) {
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
              server instanceof Droid
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

            score.calcs = Object.assign({}, calculator);
          }

          scores.push(score);
        }
      }
    }

    return {
      osuUser,
      server,
      scores,
      error,
      userData,
      indexFrom,
      indexTo
    };
  }
}

export default OsuWithCalcCommand;
