import ApiManager from '../API/ApiManager';
import AbstractUser from './AbstractUser';

class OsuDroidUser extends AbstractUser {
  public async buildUser(username: string) {
    Object.assign(this, ApiManager.droidApi.getUser(username));
    return this;
  }
}

export default OsuDroidUser;
