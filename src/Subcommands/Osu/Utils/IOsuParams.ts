import OsuServer from "@furude-osu/Servers/OsuServer";
import AbstractUser from "@furude-osu/Users/AbstractUser";


interface IOsuParams {
  osuUser: AbstractUser | undefined;
  server: OsuServer;
  error: boolean;
}

export default IOsuParams;
