import { Beatmap } from 'node-osu';

class OwnedBeatmap implements Beatmap {
  id: string;
  beatmapSetId: string;
  hash: string;
  title: string;
  creator: string;
  version: string;
  source: string;
  artist: string;
  genre: {
    '0': string;
    '1': string;
    '10': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    '7': string;
    '9': string;
  };
  language: {
    '0': string;
    '1': string;
    '10': string;
    '11': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    '7': string;
    '8': string;
    '9': string;
  };
  rating: number;
  bpm: number;
  mode: { '0': string; '1': string; '2': string; '3': string };
  tags: string[];
  approvalStatus: {
    '-1': string;
    '-2': string;
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
  };
  raw_submitDate: string;
  raw_approvedDate: string;
  raw_lastUpdate: string;
  maxCombo: number;
  objects: { normal: number; slider: number; spinner: number };
  difficulty: {
    rating: number;
    aim: number;
    speed: number;
    size: number;
    overall: number;
    approach: number;
    drain: number;
  };
  length: { total: number; drain: number };
  counts: {
    favorites: number;
    favourites: number;
    plays: number;
    passes: number;
  };
  hasDownload: boolean;
  hasAudio: boolean;
}

export default OwnedBeatmap;
