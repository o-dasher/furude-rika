import ApiManager from '@furude-osu/API/ApiManager';
import OsuUser from '@furude-osu/Users/OsuUser';
import OsuScore from '@furude-osu/Users/score/OsuScore';
import BanchoScore from '@furude-osu/Users/score/BanchoScore';

class BanchoUser extends OsuUser {
  public async buildUser(username: string | number) {
    const u = username.toString();
    Object.assign(this, await ApiManager.banchoApi.getUser({ u }));
    this.accuracyFormatted = `${this.accuracy!.toFixed(2)}%`;
    this.profileUrl = `https://osu.ppy.sh/users/${this.id}`;
    this.avatarUrl = `http://s.ppy.sh/a/${this.id}`;
    return this;
  }
  public async getScores(params: { limit?: number }): Promise<OsuScore[]> {
    return (
      await ApiManager.banchoApi.getUserRecent({
        u: this.id!.toString(),
        limit: params.limit
      })
    ).map((v) => new BanchoScore(v));
  }
  public async getBests(): Promise<OsuScore[]> {
    return (
      await ApiManager.banchoApi.getUserBest({
        u: this.id!.toString()
      })
    ).map((v) => new BanchoScore(v));
  }
}

export default BanchoUser;
