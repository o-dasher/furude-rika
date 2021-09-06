import OsuServer from '../Osu!/Servers/OsuServer';
import OsuServers from '../Osu!/Servers/OsuServers';
import AbstractUser from '../Osu!/Users/AbstractUser';
import IDBUser from './IDBUser';

abstract class DBUserHelper {
  private constructor() {}

  public static getUserName(userData: IDBUser, server: OsuServer) {
    let usernameOrID = userData.osu.bancho.toString();
    switch (server) {
      case OsuServers.droid:
        usernameOrID = userData.osu.droid.toString();
        break;
    }
    return usernameOrID;
  }

  public static changeUserName(
    osuUser: AbstractUser | undefined,
    userData: IDBUser,
    server: OsuServer
  ) {
    if (osuUser != null) {
      switch (server) {
        case OsuServers.droid:
          userData.osu.droid = osuUser.id;
          break;
        default:
          userData.osu.bancho = osuUser.id;
          break;
      }
    }
  }
}

export default DBUserHelper;
