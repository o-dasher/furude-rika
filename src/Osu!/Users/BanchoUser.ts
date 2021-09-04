import ApiManager from '../API/ApiManager';
import AbstractUser from './AbstractUser';

class BanchoUser extends AbstractUser {
  public async buildUser(username: string) {
    Object.assign(this, await ApiManager.banchoApi.getUser({ u: username }));
    this.accuracyFormatted = `${this.accuracy.toFixed(2)}%`;
    this.profileUrl = `https://osu.ppy.sh/users/${this.id}`;
    this.avatarUrl = `http://s.ppy.sh/a/${this.id}`;
    return this;
  }
}

export default BanchoUser;
