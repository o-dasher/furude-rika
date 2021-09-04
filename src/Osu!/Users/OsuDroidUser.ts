import AbstractUser from './AbstractUser';

class OsuDroidUser extends AbstractUser {
  public async buildUser(username: string) {
    return this;
  }
}

export default OsuDroidUser;
