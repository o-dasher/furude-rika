import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuServers from '@furude-osu/Servers/OsuServers';
import AbstractUser from '@furude-osu/Users/AbstractUser';
import IDBUser from '@furude-db/IDBUser';

abstract class DBUserHelper {
  private constructor() {}

  private static getIDAsStringIfExists(id: number): string | null {
    return id ? id.toString() : null;
  }

  public static getUserName(
    userData: IDBUser,
    server: OsuServer
  ): string | null {
    if (userData.osu) {
      let usernameOrID = this.getIDAsStringIfExists(userData.osu.bancho);
      switch (server) {
        case OsuServers.droid:
          usernameOrID = this.getIDAsStringIfExists(userData.osu.droid);
          break;
      }
      return usernameOrID;
    } else {
      return null;
    }
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
