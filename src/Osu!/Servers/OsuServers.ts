import Bancho from '@furude-osu/Servers/Bancho';
import Droid from '@furude-osu/Servers/Droid';
import OsuServer from '@furude-osu/Servers/OsuServer';

class OsuServers {
  public static bancho: Bancho = new Bancho();
  public static droid: Droid = new Droid();
  public static servers: OsuServer[] = [this.bancho, this.droid];

  public static getFromString(serverName: string): OsuServer {
    let getServer: OsuServer = OsuServers.bancho;
    for (const osuServer of OsuServers.servers) {
      if (osuServer.name === serverName) {
        getServer = osuServer;
        break;
      }
    }
    return getServer;
  }
}

export default OsuServers;
