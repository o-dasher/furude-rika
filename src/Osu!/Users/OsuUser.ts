import OsuScore from '@furude-osu/Users/score/OsuScore';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuServers from '@furude-osu/Servers/OsuServers';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import StringUtils from '@furude-utils/StringUtils';
import BanchoUser from './BanchoUser';
import OsuDroidUser from './OsuDroidUser';
import { CommandInteraction } from 'discord.js';
import DBUser from '@furude-db/DBUser';
import { Skills } from '@furude-db/DBDroidUser';

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
  public skills: Skills = {
    speed: 0,
    aim: 0
  };
  public abstract buildUser(username: string | number): Promise<OsuUser>;
  public abstract getScores(params: { limit?: number }): Promise<OsuScore[]>;
  public abstract getBests(): Promise<OsuScore[]>;
}

export default OsuUser;
