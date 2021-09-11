import { Beatmap, Score } from 'node-osu';
import {
  DroidPerformanceCalculator,
  Mod,
  OsuPerformanceCalculator
} from 'osu-droid';
import OwnedAPIBeatmap from '@furude-osu/Users/beatmaps/OwnedAPIBeatmap';

abstract class OsuScore implements Score {
  score: number = -1;
  user: { name: string; id: string } = {
    name: '',
    id: ''
  };
  beatmapId: string | Beatmap = '';
  counts: {
    '300': number;
    '100': number;
    '50': number;
    geki: number;
    katu: number;
    miss: number;
  } = {
    '300': -1,
    '100': -1,
    '50': -1,
    geki: -1,
    katu: -1,
    miss: -1
  };
  maxCombo: number = -1;
  perfect: boolean = false;
  raw_date: string = '';
  rank: string = '';
  pp: number = -1;
  hasReplay: boolean = false;
  raw_mods: number = -1;
  beatmap: OwnedAPIBeatmap = new OwnedAPIBeatmap();
  date: string | Date = '';
  mods: string | string[] = '';
  accuracy: number = -1;
  processedMods: Mod[] = [];
  calcs: OsuPerformanceCalculator | DroidPerformanceCalculator | null = null;
}

export default OsuScore;
