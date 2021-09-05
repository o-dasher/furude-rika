import ApiManager from '../API/ApiManager';
import AbstractUser from './AbstractUser';
import AbstractScore from './score/AbstractScore';
import BanchoScore from './score/BanchoScore';

class BanchoUser extends AbstractUser {
  public async buildUser(username: string) {
    Object.assign(this, await ApiManager.banchoApi.getUser({ u: username }));
    this.accuracyFormatted = `${this.accuracy.toFixed(2)}%`;
    this.profileUrl = `https://osu.ppy.sh/users/${this.id}`;
    this.avatarUrl = `http://s.ppy.sh/a/${this.id}`;
    return this;
  }
  public async getScores(): Promise<AbstractScore[]> {
    const scores = await ApiManager.banchoApi.getScores({u: this.name});
    const banchoScores: BanchoScore[] = [];

    for (const score of scores) {
      banchoScores.push(new BanchoScore(score));
    }

    return banchoScores;
  }
}

export default BanchoUser;
