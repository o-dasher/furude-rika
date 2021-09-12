interface DBGUildOsu {
  tracks?: DBGuildOsuTrack[];
  trackChannelID?: string;
}

interface DBGuildOsuTrack {
  id: number;
  server: string;
}

class DBGuild {
  osu: DBGUildOsu = {
    tracks: [],
    trackChannelID: ''
  };
}

export default DBGuild;
export { DBGUildOsu, DBGuildOsuTrack };
