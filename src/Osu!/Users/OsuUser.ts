import OsuScore from '@furude-osu/Users/score/OsuScore';

abstract class OsuUser {
  id: number | null = null;
  name: string | null = null;
  counts: {
    '300': number | null;
    '100': number | null;
    '50': number | null;
    SSH: number | null;
    SS: number | null;
    SH: number | null;
    S: number | null;
    A: number | null;
    plays: number | null;
  } | null = null;
  scores: {
    ranked: number | null;
    total: number | null;
  } | null = null;
  pp: {
    raw: Number | null;
    rank: Number | null;
    countryRank: Number | null;
  } | null = null;
  country: string | null = null;
  level: number | null = null;
  accuracy: number | null = null;
  secondsPlayed: number | null = null;
  raw_joinDate: string | null = null;
  events: any | null = null;
  joinDate: string | Date | null = null;
  accuracyFormatted: string | null = null;
  profileUrl: string | null = null;
  avatarUrl: string | null = null;
  public abstract buildUser(username: string | number): Promise<OsuUser>;
  public abstract getScores(params: {
    limit?: number;
  }): Promise<OsuScore[]>;
}

export default OsuUser;
