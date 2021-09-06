import AbstractScore from '../../../../Osu!/Users/score/AbstractScore';
import IOsuParams from './IOsuParams';

interface IOSuWithCalc extends IOsuParams {
  scores: AbstractScore[] | null;
}

export default IOSuWithCalc;
