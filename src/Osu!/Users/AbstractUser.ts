import { User } from 'node-osu';
import AbstractScore from './score/AbstractScore';

abstract class AbstractUser implements User {
  public defaultString = '';
  public defaultNumber = -1;

  public id: number = this.defaultNumber;
  public name: string = this.defaultString;
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
  } = {
    '300': this.defaultNumber,
    '100': this.defaultNumber,
    '50': this.defaultNumber,
    SSH: this.defaultNumber,
    SS: this.defaultNumber,
    SH: this.defaultNumber,
    S: this.defaultNumber,
    A: this.defaultNumber,
    plays: this.defaultNumber
  };
  public scores: { ranked: number; total: number } = {
    ranked: this.defaultNumber,
    total: this.defaultNumber
  };
  public pp: {
    raw: Number;
    rank: Number;
    countryRank: Number;
  } = {
    raw: this.defaultNumber,
    rank: this.defaultNumber,
    countryRank: this.defaultNumber
  };
  public country: string = this.defaultString;
  public level: number = this.defaultNumber;
  public accuracy: number = this.defaultNumber;
  public secondsPlayed: number = this.defaultNumber;
  public raw_joinDate: string = this.defaultString;
  public events: any;
  public joinDate: string | Date = this.defaultString;
  public accuracyFormatted: string = this.defaultString;
  public profileUrl: string = this.defaultString;
  public avatarUrl: string = this.defaultString;

  public abstract buildUser(username: string | number): Promise<AbstractUser>;
  public abstract getScores(): Promise<AbstractScore[]>;
}

export default AbstractUser;
