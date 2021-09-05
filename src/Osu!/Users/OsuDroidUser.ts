import ApiManager from '../API/ApiManager';
import AbstractUser from './AbstractUser';
import AbstractScore from './score/AbstractScore';
import OsuDroidScore from './score/OsuDroidScore';

class OsuDroidUser extends AbstractUser {
  public droidScores: OsuDroidScore[] = [];

  public async buildUser(username: string | number) {
    Object.assign(this, await ApiManager.droidApi.getUser(username.toString()));
    return this;
  }

  public async getScores(): Promise<AbstractScore[]> {
    return this.droidScores;
  }
}

export default OsuDroidUser;
