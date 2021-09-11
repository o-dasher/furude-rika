import DBUser from '@furude-db/DBUser';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuUser from '@furude-osu/Users/OsuUser';

interface IOsuParams {
  osuUser: OsuUser | undefined;
  server: OsuServer;
  error: boolean;
  userData: DBUser;
}

export default IOsuParams;
