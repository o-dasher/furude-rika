interface DBGUildOsu {
  tracks: DBGuildOsuTrack[];
  trackChannelID: string;
  leaderboardChannelID: string;
  minPP: number;
}

interface DBGuildOsuTrack {
  id: number;
  server: string;
}

class DBGuild {
  osu: DBGUildOsu = {
    tracks: [],
    trackChannelID: '',
    leaderboardChannelID: '',
    minPP: 0
  };
}

export default DBGuild;
export { DBGUildOsu, DBGuildOsuTrack };
