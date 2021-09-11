import { User } from 'discord.js';
import { firestore } from 'firebase-admin';
import DBPaths from '@furude-db/DBPaths';
import DBUser from '@furude-db/DBUser';

abstract class DBManager {
  private constructor() {}

  public static furudeDB: firestore.Firestore;

  public static init() {
    this.furudeDB = firestore();
  }

  public static getUserDoc(id: string) {
    return DBManager.furudeDB.collection(DBPaths.users).doc(id);
  }

  public static async getUserData(discordUser: User): Promise<DBUser> {
    return Object.assign(
      new DBUser(),
      (await this.getUserDoc(discordUser.id).get()).data()
    );
  }
}

export default DBManager;
