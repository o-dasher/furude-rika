import AbstractScore from '@furude-osu/Users/score/AbstractScore';
import IOsuParams from '@furude-subs/Osu/Utils/IOsuParams';

interface IOSuWithCalc extends IOsuParams {
  scores: AbstractScore[] | null;
  indexFrom: number;
  indexTo: number;
}

export default IOSuWithCalc;
