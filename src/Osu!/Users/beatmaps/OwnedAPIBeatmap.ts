import { Beatmap } from 'node-osu';

class OwnedAPIBeatmap implements Beatmap {
  exists: boolean = true;
  id: string = '';
  beatmapSetId: string = '';
  hash: string = '';
  title: string = '';
  creator: string = '';
  version: string = '';
  source: string = '';
  artist: string = '';
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
  } = {
    '0': '',
    '1': '',
    '10': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '9': ''
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
  } = {
    '0': '',
    '1': '',
    '10': '',
    '11': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': ''
  };
  rating: number = 0;
  bpm: number = 0;
  mode: { '0': string; '1': string; '2': string; '3': string } = {
    '0': '',
    '1': '',
    '2': '',
    '3': ''
  };
  tags: string[] = [];
  approvalStatus: {
    '-1': string;
    '-2': string;
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
  } = {
    '-1': '',
    '-2': '',
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': ''
  };
  raw_submitDate: string = '';
  raw_approvedDate: string = '';
  raw_lastUpdate: string = '';
  maxCombo: number = 0;
  objects: { normal: number; slider: number; spinner: number } = {
    normal: 0,
    slider: 0,
    spinner: 0
  };
  difficulty: {
    rating: number;
    aim: number;
    speed: number;
    size: number;
    overall: number;
    approach: number;
    drain: number;
  } = {
    rating: 0,
    aim: 0,
    speed: 0,
    size: 0,
    overall: 0,
    approach: 0,
    drain: 0
  };
  length: { total: number; drain: number } = {
    total: 0,
    drain: 0
  };
  counts: {
    favorites: number;
    favourites: number;
    plays: number;
    passes: number;
  } = {
    favorites: 0,
    favourites: 0,
    plays: 0,
    passes: 0
  };
  hasDownload: boolean = false;
  hasAudio: boolean = false;
}

export default OwnedAPIBeatmap;
