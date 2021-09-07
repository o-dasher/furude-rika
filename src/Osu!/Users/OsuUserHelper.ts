import AbstractUser from '@furude-osu/Users/AbstractUser';

class OsuUserHelper {
  public static userExists(osuUser: AbstractUser): boolean {
    return osuUser != null && osuUser.name != '';
  }
}

export default OsuUserHelper;
