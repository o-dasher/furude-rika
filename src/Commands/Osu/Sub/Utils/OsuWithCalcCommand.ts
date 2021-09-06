import axios from 'axios';
import consolaGlobalInstance from 'consola';
import { CommandInteraction } from 'discord.js';
import {
  DroidPerformanceCalculator,
  DroidStarRating,
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
  async getScores(
    interaction: CommandInteraction,
    indexFrom: number,
    indexTo: number
  ): Promise<IOSuWithCalc> {
    const params = await super.getOsuParams(interaction);

    const { osuUser, server } = params;
    let { error } = params;

    const osuParser = new Parser();
    const calculator =
      server instanceof Droid
        ? new DroidPerformanceCalculator()
        : new OsuPerformanceCalculator();

    let scores: AbstractScore[] = [];

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
        for (let i = 0; i < indexTo + 1; i++) {
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
            consolaGlobalInstance.error(err);
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
            const mapDownloadUrl = `https://osu.ppy.sh/osu/${score.beatmap.id}`;
            const osu = await axios.get(mapDownloadUrl);
            const map = osuParser.parse(osu.data, score.processedMods).map;
            const stars = calculator.stars.calculate({
              map,
              mods: score.processedMods
            });

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
      error
    };
  }
}

export default OsuWithCalcCommand;
