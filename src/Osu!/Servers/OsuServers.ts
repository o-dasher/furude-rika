import BanchoServer from '@furude-osu/Servers/BanchoServer';
import DroidServer from '@furude-osu/Servers/DroidServer';
import OsuServer from '@furude-osu/Servers/OsuServer';

class OsuServers {
  public static bancho: BanchoServer = new BanchoServer();
  public static droid: DroidServer = new DroidServer();
  public static servers: OsuServer[] = [this.bancho, this.droid];

  public static getFromString(serverName: string): OsuServer {
    return (
      this.servers.filter((s) => s.name === serverName)[0] ?? OsuServers.bancho
    );
  }
}

export default OsuServers;
