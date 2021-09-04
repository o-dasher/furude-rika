import Bancho from './Bancho';
import OsuServer from './OsuServer';

class OsuServers {
  public static bancho: Bancho = new Bancho();
  public static servers: OsuServer[] = [this.bancho];

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
