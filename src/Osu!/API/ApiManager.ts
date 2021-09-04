import { osuApiKey } from '../../json/config.json';
import osu from 'node-osu';
import DroidScrapeApi from './DroidScrapeApi';

class ApiManager {
  public static banchoApi = new osu.Api(osuApiKey, {
    completeScores: true,
    parseNumeric: true
  });
  public static droidApi = new DroidScrapeApi();
}

export default ApiManager;
