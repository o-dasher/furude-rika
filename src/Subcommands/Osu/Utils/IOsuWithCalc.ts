import OsuScore from '@furude-osu/Users/score/OsuScore';
import IOsuParams from '@furude-subs/Osu/Utils/IOsuParams';

interface IOSuWithCalc extends IOsuParams {
  scores: OsuScore[] | null;
  indexFrom: number;
  indexTo: number;
}

export default IOSuWithCalc;
