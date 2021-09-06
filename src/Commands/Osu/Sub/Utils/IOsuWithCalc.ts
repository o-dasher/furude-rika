import {
  DroidPerformanceCalculator,
  Mod,
  OsuPerformanceCalculator,
  Parser
} from 'osu-droid';
import OwnedAPIBeatmap from '../../../../Osu!/Users/beatmaps/OwnedAPIBeatmap';
import AbstractScore from '../../../../Osu!/Users/score/AbstractScore';
import IOsuParams from './IOsuParams';

interface IOSuWithCalc extends IOsuParams {
  osuParser: Parser;
  calculator: OsuPerformanceCalculator | DroidPerformanceCalculator;
  score: AbstractScore | null;
  apiBeatmap: OwnedAPIBeatmap | null;
  mods: Mod[];
  mapExists: boolean;
}

export default IOSuWithCalc;
