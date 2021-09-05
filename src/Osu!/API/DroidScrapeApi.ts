import OsuDroidUser from '../Users/OsuDroidUser';
import ParamString from './ParamString';
import cheerio from 'cheerio';
import axios from 'axios';
import OsuDroidScore from '../Users/score/OsuDroidScore';
import OwnedBeatmap from '../Users/beatmaps/OwnedBeatmap';

class DroidScrapeApi {
  private baseUrl = 'http://ops.dgsrz.com/';
  private profileEndPoint = new ParamString(this.baseUrl.concat('profile.php'));

  public async getUser(username: string): Promise<OsuDroidUser> {
    let user: OsuDroidUser = new OsuDroidUser();
    let finalEndpoint = new ParamString(this.profileEndPoint.toString());
    finalEndpoint.addParam('uid', username);

    const res = await axios.get(finalEndpoint.toString());

    const $ = cheerio.load(res.data);

    user.name = $('div.h3.m-t-xs.m-b-xs').text();
    user.country = $('small.text-muted').first().text();
    user.counts = {
      '300': 0,
      '100': 0,
      '50': 0,
      SSH: 0,
      SS: 0,
      SH: 0,
      S: 0,
      A: 0,
      plays: 0
    };
    user.level = 0;
    user.pp = { raw: 0, rank: 0, countryRank: 0 };
    user.scores = { ranked: 0, total: 0 };
    user.pp.rank = parseInt($('span.m-b-xs.h4.block').first().text());
    user.pp.countryRank = user.pp.rank;
    user.id = parseInt(username);
    user.profileUrl = `http://ops.dgsrz.com/profile.php?uid=${user.id}`;

    const images = $('img');

    for (let i = 0; i < images.length; i++) {
      const el = images[i];
      if (i == 3 && el.attribs.src != undefined) {
        user.avatarUrl = el.attribs.src;
        break;
      }
    }

    const pullRight = $('span.pull-right');

    for (let i = 0; i < pullRight.length; i++) {
      if (i <= 2) {
        continue;
      }

      const el = $.load(pullRight[i]);
      const textSafe = el.text().replaceAll(',', '');
      const val = parseFloat(textSafe);

      switch (i) {
        case 3:
          user.scores.total = val;
          user.scores.ranked = val;
          break;
        case 4:
          user.accuracy = val;
          user.accuracyFormatted = `${val.toFixed(2)}%`;
          break;
        case 5:
          user.counts.plays = val;
          break;
      }
    }

    const liListGroupItem = $('li.list-group-item');
    for (let i = 0; i < liListGroupItem.length; i++) {
      if (i > liListGroupItem.length - 9) {
        break;
      }

      const score = new OsuDroidScore();
      score.beatmap = new OwnedBeatmap();

      const el = $.load(liListGroupItem[i]);
      let idk = el.text().replaceAll('\n', '').replaceAll('  ', '').split(']');

      const headData = idk[0].split('[');
      score.beatmap.title = headData[0].slice(0, -1);
      score.beatmap.version = headData[1];

      idk = idk.slice(1).join('').split('%');

      const stats = idk[0].split('/');
      for (const stat of stats) {
        if (score.raw_date == null && score.date == null) {
          const date = stat.slice(0, -1);
          score.date = date;
          score.raw_date = date;
        } else if (score.score == null) {
          score.score = parseInt(stat.replaceAll(',', ''));
        } else if (score.mods == null) {
          score.mods = stat;
        } else if (score.maxCombo == null) {
          score.maxCombo = parseInt(stat.replace('x', ''));
        } else if (score.accuracy == null) {
          score.accuracy = parseFloat(stat);
        }
      }

      idk = idk.slice(1);
      const hiddenSep = idk.join().split(':');

      score.counts = {
        '300': 0,
        '100': 0,
        '50': 0,
        geki: 0,
        katu: 0,
        miss: 0
      };

      score.counts.miss = parseInt(hiddenSep[1].split(',')[0]);
      score.beatmap.hash = hiddenSep[2].replace('}', '').replaceAll(' ', '');

      score.user = {
        name: user.name,
        id: user.id.toString()
      };

      user.droidScores.push(score);
    }

    return user;
  }
}

export default DroidScrapeApi;
