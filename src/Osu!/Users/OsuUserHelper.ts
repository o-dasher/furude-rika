import OsuUser from '@furude-osu/Users/OsuUser';

class OsuUserHelper {
  public static userExists(osuUser: OsuUser): boolean {
    return osuUser != null && osuUser.name != '';
  }
}

export default OsuUserHelper;
