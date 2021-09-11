import Bancho from '@furude-osu/Servers/Bancho';
import Droid from '@furude-osu/Servers/Droid';
import OsuServer from '@furude-osu/Servers/OsuServer';

class OsuServers {
  public static bancho: Bancho = new Bancho();
  public static droid: Droid = new Droid();
  public static servers: OsuServer[] = [this.bancho, this.droid];

  public static getFromString(serverName: string): OsuServer {
    return (
      this.servers.filter((s) => s.name === serverName)[0] ?? OsuServers.bancho
    );
  }
}

export default OsuServers;
