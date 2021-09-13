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
    indexTo: number
  ): Promise<IOSuWithCalc> {
    const params = await super.getOsuParams(interaction, {
      needsExtraInfo: false
    });

    const { osuUser, server, userData } = params;
    let { error } = params;

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
      indexTo
    };
  }
}

export default OsuWithCalcCommand;
