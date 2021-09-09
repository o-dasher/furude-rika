import { PerformanceCalculationParameters } from '@furude-utils/dpp/PerformanceCalculationParameters';
import { Accuracy, MapStats, Mod, ModUtil } from 'osu-droid';
/**
 * A helper to calculate difficulty and performance of beatmaps or scores.
 */
export abstract class BeatmapDifficultyHelper {
  /**
   * Gets calculation parameters from a user's message.
   *
   * @param message The user's message.
   * @returns The calculation parameters from the user's message.
   */
  static getCalculationParamsFromMessage(
    message: string
  ): PerformanceCalculationParameters {
    let mods: Mod[] = [];
    let combo: number | undefined;
    let forceAR: number | undefined;
    let speedMultiplier: number = 1;
    let accPercent: number = 100;
    let countMiss: number = 0;
    let count100: number = 0;
    let count50: number = 0;

    for (const input of message.split(/\s+/g)) {
      if (input.endsWith('%')) {
        const newAccPercent = parseFloat(input);
        accPercent = Math.max(0, Math.min(newAccPercent || 0, 100));
      }
      if (input.endsWith('m')) {
        const newCountMiss = parseInt(input);
        countMiss = Math.max(0, newCountMiss || 0);
      }
      if (input.endsWith('x')) {
        if (input.includes('.')) {
          speedMultiplier = Math.max(
            0.5,
            Math.min(2, parseFloat(parseFloat(input).toFixed(2)) || 1)
          );
        } else {
          const newCombo = parseInt(input);
          combo = Math.max(0, newCombo || 0);
        }
      }
      if (input.startsWith('+')) {
        mods.push(...ModUtil.pcStringToMods(input.replace('+', '')));
      }
      if (input.startsWith('AR')) {
        forceAR = Math.max(
          0,
          Math.min(
            12.5,
            parseFloat(parseFloat(input.substring(2)).toFixed(2)) || 0
          )
        );
      }
      if (input.endsWith('x50')) {
        count50 = Math.max(0, parseInt(input) || 0);
      }
      if (input.endsWith('x100')) {
        count100 = Math.max(0, parseInt(input) || 0);
      }
    }

    const stats: MapStats = new MapStats({
      ar: forceAR,
      speedMultiplier: speedMultiplier,
      isForceAR: !isNaN(<number>forceAR)
    });

    return new PerformanceCalculationParameters(
      mods,
      new Accuracy({
        n100: count100,
        n50: count50,
        nmiss: countMiss
      }),
      accPercent,
      combo,
      1,
      stats
    );
  }
}
