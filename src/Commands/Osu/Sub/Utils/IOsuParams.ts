import OsuServer from '../../../../Osu!/Servers/OsuServer';
import AbstractUser from '../../../../Osu!/Users/AbstractUser';

interface IOsuParams {
  osuUser: AbstractUser | undefined;
  server: OsuServer;
  error: boolean;
}

export default IOsuParams;
