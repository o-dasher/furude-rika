import { osuApiKey } from '../../json/config.json';
import osu from 'node-osu';

class ApiManager {
  public static banchoApi = new osu.Api(osuApiKey, {
    completeScores: true,
    parseNumeric: true
  });
}

export default ApiManager;