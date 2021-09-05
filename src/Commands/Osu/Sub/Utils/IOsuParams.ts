import OsuServer from '../../../../Osu!/Servers/OsuServer';
import AbstractUser from '../../../../Osu!/Users/AbstractUser';

interface IOsuParams {
  osuUser: AbstractUser | undefined;
  server: OsuServer;
}

export default IOsuParams;
