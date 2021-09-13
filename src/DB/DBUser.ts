import DroidPPBoardPP from '@furude-osu/API/DroidPPBoardPP';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuServers from '@furude-osu/Servers/OsuServers';
import OsuUser from '@furude-osu/Users/OsuUser';

interface Osu {
  defaultServer: string | null;
  bancho: number | null;
  droid: number | null;
}

class DBUser {
  osu: Osu = {
    defaultServer: OsuServers.bancho.name,
    bancho: null,
    droid: null
  };

  private getIDAsStringIfExists(id: number | null): string | null {
    return id == null ? null : id.toString();
  }

  public getUserName(server: OsuServer): string | null {
    let usernameOrID = this.getIDAsStringIfExists(this.osu.bancho);
    switch (server) {
      case OsuServers.droid:
        usernameOrID = this.getIDAsStringIfExists(this.osu.droid);
        break;
    }
    return usernameOrID;
  }

  public changeUserName(osuUser: OsuUser | undefined, server: OsuServer) {
    if (osuUser != null && osuUser.id) {
      switch (server) {
        case OsuServers.droid:
          this.osu.droid = osuUser.id;
          break;
        default:
          this.osu.bancho = osuUser.id;
          break;
      }
    }
  }
}

export default DBUser;
