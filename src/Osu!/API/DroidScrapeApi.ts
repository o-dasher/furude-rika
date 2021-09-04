import OsuDroidUser from '../Users/OsuDroidUser';
import ParamString from './ParamString';
import cheerio from 'cheerio';
import axios from 'axios';

class DroidScrapeApi {
  private baseUrl = 'http://ops.dgsrz.com/';
  private profileEndPoint = new ParamString(
    this.baseUrl.concat('profile.php')
  );

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
      const val = parseInt(textSafe);

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

    return user;
  }
}

export default DroidScrapeApi;
