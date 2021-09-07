import ApiManager from '@furude-osu/API/ApiManager';
import AbstractUser from '@furude-osu/Users/AbstractUser';
import AbstractScore from '@furude-osu/Users/score/AbstractScore';
import BanchoScore from '@furude-osu/Users/score/BanchoScore';

class BanchoUser extends AbstractUser {
  public async buildUser(username: string | number) {
    const u = username.toString();
    Object.assign(this, await ApiManager.banchoApi.getUser({ u }));
    this.accuracyFormatted = `${this.accuracy.toFixed(2)}%`;
    this.profileUrl = `https://osu.ppy.sh/users/${this.id}`;
    this.avatarUrl = `http://s.ppy.sh/a/${this.id}`;
    return this;
  }
  public async getScores(): Promise<AbstractScore[]> {
    const scores = await ApiManager.banchoApi.getScores({ u: this.name });
    const banchoScores: BanchoScore[] = [];

    for (const score of scores) {
      banchoScores.push(new BanchoScore(score));
    }

    return banchoScores;
  }
}

export default BanchoUser;
