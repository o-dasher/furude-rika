import axios from 'axios';
import BaseApi from '@furude-osu/API/BaseApi';
import ParamString from '@furude-osu/API/ParamString';
import DroidPPBoardUser from './DroidPPBoardUser';

class DroidPPBoardAPI extends BaseApi {
  public override baseUrl = 'https://droidppboard.herokuapp.com/api/';
  public readonly playerTopURL = this.baseUrl + 'getplayertop';
  private readonly apiKey: string;

  public constructor(params: { apiKey: string }) {
    super();
    this.apiKey = params.apiKey;
  }

  async getPlayerTop(uid: string | number): Promise<DroidPPBoardUser> {
    const endpoint = new ParamString(this.playerTopURL);
    endpoint.addParam('key', this.apiKey);
    endpoint.addParam('uid', typeof uid == 'string' ? uid : uid.toString());
    const data = await (await axios.get(endpoint.toString())).data.data;
    return data as DroidPPBoardUser;
  }
}

export default DroidPPBoardAPI;
