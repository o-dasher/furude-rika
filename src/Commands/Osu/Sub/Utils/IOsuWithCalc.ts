import AbstractScore from '../../../../Osu!/Users/score/AbstractScore';
import IOsuParams from './IOsuParams';

interface IOSuWithCalc extends IOsuParams {
  scores: AbstractScore[] | null;
  indexFrom: number;
  indexTo: number;
}

export default IOSuWithCalc;
