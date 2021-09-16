import OsuDroidUser from '@furude-osu/Users/OsuDroidUser';
import ParamString from '@furude-osu/API/ParamString';
import cheerio from 'cheerio';
import axios from 'axios';
import OsuDroidScore from '@furude-osu/Users/score/OsuDroidScore';
import OwnedAPIBeatmap from '@furude-osu/Users/beatmaps/OwnedAPIBeatmap';
import BaseApi from '@furude-osu/API/BaseApi';
import DBUser from '@furude-db/DBUser';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import DBDroidUser from '@furude-db/DBDroidUser';

class DroidScrapeApi extends BaseApi {
  public override baseUrl = 'http://ops.dgsrz.com/';
  private profileEndPoint = new ParamString(`${this.baseUrl}profile.php`);

  public async getUser(
    username: string,
    userData?: DBUser,
    limit?: number,
    needsExtraInfo?: boolean
  ): Promise<OsuDroidUser> {
    needsExtraInfo = needsExtraInfo ?? true;
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
    if (needsExtraInfo) {
      const data: DBDroidUser = Object.assign(
        new DBDroidUser(),
        (
          await FurudeDB.db()
            .collection(DBPaths.droid_users)
            .doc(user.id.toString())
            .get()
        ).data()
      );
      user.skills = data.skills;
      user.bests = data.dpp.list.map((s) => {
        const score = new OsuDroidScore();
        score.accuracy = s.accuracy;
        score.maxCombo = s.combo;
        score.mods = s.mods;
        score.pp = s.pp;
        score.counts.miss = s.miss;
        return score;
      });
      user.pp.raw = data.dpp.total;
    }

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
    limit = Math.min(liListGroupItem.length, limit ?? liListGroupItem.length);
    for (let i = 0; i < limit; i++) {
      if (i > liListGroupItem.length - 9) {
        break;
      }

      const score = new OsuDroidScore();
      score.beatmap = new OwnedAPIBeatmap();
      const html = liListGroupItem[i];
      const el = $.load(html);
      const head = el('strong.block').text();

      let splitHead = head.split('-');
      score.beatmap.creator = splitHead[0];
      splitHead.shift();
      splitHead = splitHead.join().split('[');

      score.beatmap.title = splitHead[0].replaceAll('  ', '');
      score.beatmap.version = splitHead[1]
        ? splitHead[1].substr(0, splitHead[1].length - 1)
        : '';

      const small = el('small').text().split('/');

      score.raw_date = small[0].slice(0, -1);
      score.date = new Date(score.raw_date);
      score.date.setHours(
        score.date.getHours() - (score.date.getTimezoneOffset() / 60 + 2)
      );
      score.raw_date = score.date.toTimeString();

      score.score = parseInt(small[1].replaceAll(',', '').replaceAll(' ', ''));
      score.mods = small[2]

        .replace('DoubleTime', 'DT')
        .replace('HardRock', 'HR')
        .replace('Precise', 'PR')
        .replace('NightCore', 'NC')
        .replace('Hidden', 'HD')
        .replace('NoFail', 'NF')
        .replace('HalfTime', 'HT')
        .replace('Easy', 'EZ')
        .replaceAll(',', '')
        .replaceAll(' ', '');
      if (score.mods === '') {
        score.mods = 'NM';
      }

      score.maxCombo = parseInt(small[3].replace('x', ''));
      score.accuracy = parseFloat(small[4]);

      const hiddenStats = el('span.hidden')
        .text()
        .replaceAll('"', '')
        .replaceAll(':', '')
        .replaceAll('{', '')
        .replaceAll('}', '')
        .replaceAll('miss', '')
        .replaceAll('hash', '')
        .replaceAll(' ', '')
        .split(',');

      score.counts = {
        '300': 0,
        '100': 0,
        '50': 0,
        geki: 0,
        katu: 0,
        miss: 0
      };

      score.counts.miss = parseInt(hiddenStats[0]);
      score.beatmap.hash = hiddenStats[1];

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
