import { Cheerio, CheerioAPI } from 'cheerio';
import ApiManager from '../API/ApiManager';
import AbstractUser from './AbstractUser';

class OsuDroidUser extends AbstractUser {
  private $: CheerioAPI;

  public async buildUser(username: string) {
    Object.assign(this, await ApiManager.droidApi.getUser(username));
    return this;
  }
}

export default OsuDroidUser;
