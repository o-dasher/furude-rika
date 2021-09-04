import Bancho from './Bancho';
import Droid from './Droid';
import OsuServer from './OsuServer';

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
