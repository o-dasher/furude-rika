import { Beatmap, Score } from 'node-osu';

abstract class AbstractScore implements Score {
  score: number;
  user: { name: string; id: string };
  beatmapId: string | Beatmap;
  counts: {
    '300': number;
    '100': number;
    '50': number;
    geki: number;
    katu: number;
    miss: number;
  };
  maxCombo: number;
  perfect: boolean;
  raw_date: string;
  rank: string;
  pp: number;
  hasReplay: boolean;
  raw_mods: number;
  beatmap: Beatmap;
  date: string | Date;
  mods: string | string[];
  accuracy: number;
}

export default AbstractScore;
