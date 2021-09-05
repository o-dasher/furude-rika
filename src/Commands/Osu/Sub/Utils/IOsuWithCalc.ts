import {
  DroidPerformanceCalculator,
  OsuPerformanceCalculator,
  Parser
} from 'osu-droid';
import IOsuParams from './IOsuParams';

interface IOSuWithCalc extends IOsuParams {
  osuParser: Parser;
  calculator: OsuPerformanceCalculator | DroidPerformanceCalculator;
}

export default IOSuWithCalc;
