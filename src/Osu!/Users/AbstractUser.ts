import { User } from 'node-osu';

abstract class AbstractUser implements User {
  public id: number;
  public name: string;
  public counts: {
    '300': number;
    '100': number;
    '50': number;
    SSH: number;
    SS: number;
    SH: number;
    S: number;
    A: number;
    plays: number;
  };
  public scores: { ranked: number; total: number };
  public pp: {
    raw: Number;
    rank: Number;
    countryRank: Number;
  };
  public country: string;
  public level: number;
  public accuracy: number;
  public secondsPlayed: number;
  public raw_joinDate: string;
  public events: any;
  public joinDate: string | Date;
  public accuracyFormatted: string
  public profileUrl: string;
  public avatarUrl: string;

  public abstract buildUser(username: string): Promise<AbstractUser>;
}

export default AbstractUser;
