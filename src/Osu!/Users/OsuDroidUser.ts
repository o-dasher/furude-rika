import ApiManager from '@furude-osu/API/ApiManager';
import AbstractUser from '@furude-osu/Users/AbstractUser';
import AbstractScore from '@furude-osu/Users/score/AbstractScore';
import OsuDroidScore from '@furude-osu/Users/score/OsuDroidScore';

class OsuDroidUser extends AbstractUser {
  public droidScores: OsuDroidScore[] = [];

  public async buildUser(username: string | number) {
    Object.assign(this, await ApiManager.droidApi.getUser(username.toString()));
    return this;
  }

  public async getScores(_params: {
    limit?: number;
  }): Promise<AbstractScore[]> {
    return this.droidScores;
  }
}

export default OsuDroidUser;
