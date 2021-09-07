import { User } from 'discord.js';
import { firestore } from 'firebase-admin';
import OsuServers from '@furude-osu/Servers/OsuServers';
import DBPaths from '@furude-db/DBPaths';
import IDBUser from '@furude-db/IDBUser';

abstract class DBManager {
  private constructor() {}

  public static furudeDB: firestore.Firestore;

  public static init() {
    this.furudeDB = firestore();
  }

  public static async getUserData(discordUser: User): Promise<IDBUser> {
    const user: IDBUser = {
      osu: {
        defaultServer: OsuServers.bancho.name,
        bancho: -1,
        droid: -1
      }
    };
    const currentData = (
      await DBManager.furudeDB
        .collection(DBPaths.users)
        .doc(discordUser.id)
        .get()
    ).data();
    Object.assign(user, currentData);
    return user;
  }
}

export default DBManager;
