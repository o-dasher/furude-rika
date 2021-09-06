import osu from 'node-osu';
import DroidScrapeApi from './DroidScrapeApi';

const { OSU_API_KEY } = process.env;

class ApiManager {
  private constructor() {}

  public static banchoApi = new osu.Api(OSU_API_KEY, {
    completeScores: true,
    parseNumeric: true
  });

  public static droidApi = new DroidScrapeApi();
}

export default ApiManager;
