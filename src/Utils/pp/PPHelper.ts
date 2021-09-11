// SEE: https://github.com/Rian8337/Alice/blob/master/src/utils/helpers/DPPHelper.ts

import PPEntry from './PPEntry';

abstract class PPHelper {
  private constructor() {}

  /**
   * Calculates the final performance points from a list of pp entries.
   *
   * @param list The list.
   * @returns The final performance points.
   */
  static calculateFinalPerformancePoints(list: PPEntry[]): number {
    list.sort((a, b) => {
      return b.pp - a.pp;
    });

    return [...list.values()].reduce(
      (a, v, i) => a + v.pp * Math.pow(0.95, i),
      0
    );
  }
}

export default PPHelper;
