import osu from 'node-osu';
import DroidScrapeApi from '@furude-osu/API/DroidScrapeApi';
import DroidPPBoardAPI from './DroidPPBoardAPI';

const { OSU_API_KEY, DROID_PP_BOARD_API_KEY } = process.env;

class ApiManager {
  private constructor() {}

  public static banchoApi = new osu.Api(OSU_API_KEY, {
    completeScores: true,
    parseNumeric: true
  });

  public static droidApi = new DroidScrapeApi();
  
  public static droidPPBoardAPI = new DroidPPBoardAPI({
    apiKey: DROID_PP_BOARD_API_KEY
  });
}

export default ApiManager;
