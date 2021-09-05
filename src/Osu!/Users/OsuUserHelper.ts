import AbstractUser from './AbstractUser';

class OsuUserHelper {
  public static userExists(osuUser: AbstractUser): boolean {
    return osuUser != null && osuUser.name != '';
  }
}

export default OsuUserHelper;
