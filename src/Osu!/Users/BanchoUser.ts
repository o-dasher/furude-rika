import ApiManager from '../API/ApiManager';
import AbstractUser from './AbstractUser';

class BanchoUser extends AbstractUser {
  public async buildUser(username: string) {
    const user = await ApiManager.banchoApi.getUser({ u: username });
    this.accuracy = user.accuracy;
    this.accuracyFormatted = user.accuracyFormatted;
    this.country = user.country;
    this.counts = user.counts;
    this.events = user.events;
    this.id = user.id;
    this.joinDate = user.joinDate;
    this.level = user.level;
    this.name = user.name;
    this.pp = user.pp;
    this.raw_joinDate = user.raw_joinDate;
    this.secondsPlayed = user.secondsPlayed;
    this.scores = user.scores;
    this.profileUrl = `https://osu.ppy.sh/users/${user.id}`;
    return this;
  }
}

export default BanchoUser;
