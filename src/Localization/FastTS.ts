import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuUser from '@furude-osu/Users/OsuUser';
import ordinal from 'ordinal';

abstract class FastTS {
  private constructor() {}

  public static recentScore(
    osuUser: OsuUser | undefined,
    server: OsuServer,
    i: number
  ) {
    return `${ordinal(i + 1)} Recent play from ${osuUser!.name} on ${
      server.name
    } servers`;
  }
}

export default FastTS;
