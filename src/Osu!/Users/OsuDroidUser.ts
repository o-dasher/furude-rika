import ApiManager from '@furude-osu/API/ApiManager';
import OsuUser from '@furude-osu/Users/OsuUser';
import OsuScore from '@furude-osu/Users/score/OsuScore';
import OsuDroidScore from '@furude-osu/Users/score/OsuDroidScore';
import DBUser from '@furude-db/DBUser';

class OsuDroidUser extends OsuUser {
  public droidScores: OsuDroidScore[] = [];

  public async buildUser(
    username: string | number,
    userData?: DBUser,
    limit?: number,
    needsExtraInfo?: boolean
  ) {
    Object.assign(
      this,
      await ApiManager.droidApi.getUser(
        username.toString(),
        userData,
        limit,
        needsExtraInfo
      )
    );
    return this;
  }

  public async getScores(_params: { limit?: number }): Promise<OsuScore[]> {
    return this.droidScores;
  }
}

export default OsuDroidUser;
