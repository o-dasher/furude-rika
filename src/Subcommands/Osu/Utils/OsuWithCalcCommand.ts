import consolaGlobalInstance from 'consola';
import { CommandInteraction } from 'discord.js';
import OsuScore from '@furude-osu/Users/score/OsuScore';
import IOSuWithCalc from '@furude-subs/Osu/Utils/IOsuWithCalc';
import OsuGameCommand from '@furude-subs/Osu/Utils/OsuGameCommand';
import StringUtils from '@furude-utils/StringUtils';
import PPHelper from '@furude-utils/pp/PPHelper';

abstract class OsuWithCalcCommand extends OsuGameCommand {
  async getScores(
    interaction: CommandInteraction,
    indexFrom: number,
    extraIndexes: number
  ): Promise<IOSuWithCalc> {
    const params = await super.getOsuParams(interaction, {
      needsExtraInfo: false
    });

    const { osuUser, server, userData } = params;
    let { error } = params;

    extraIndexes = indexFrom + extraIndexes + 1;

    let scores: OsuScore[] = [];

    if (osuUser) {
      try {
        scores = await osuUser.getScores({ limit: extraIndexes });
      } catch (err) {
        error = true;
        consolaGlobalInstance.error(err);
      }

      indexFrom = Math.max(0, Math.min(indexFrom, scores.length - 1));
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
        for (let i = 0; i < extraIndexes; i++) {
          if (i < indexFrom) {
            continue;
          }
          const score = scores[i];
          await PPHelper.calculateScore(score, server);
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
      indexTo: extraIndexes
    };
  }
}

export default OsuWithCalcCommand;
