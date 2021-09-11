import { Score } from 'node-osu';
import OsuScore from '@furude-osu/Users/score/OsuScore';

class BanchoScore extends OsuScore {
  public constructor(score: Score) {
    super();
    Object.assign(this, score);
  }
}

export default BanchoScore;
