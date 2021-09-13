import { User } from 'discord.js';
import { firestore } from 'firebase-admin';
import DBPaths from '@furude-db/DBPaths';
import DBUser from '@furude-db/DBUser';
import { number } from 'mathjs';

abstract class FurudeDB {
  private constructor() {}

  private static _db: firestore.Firestore;

  public static init() {
    this._db = firestore();
  }

  public static db(): firestore.Firestore {
    return this._db;
  }

  public static getUserDoc(id: string) {
    return this.db().collection(DBPaths.users).doc(id);
  }

  public static async getUserData(id: string): Promise<DBUser> {
    return Object.assign(
      new DBUser(),
      (await this.getUserDoc(id).get()).data()
    );
  }
}

export default FurudeDB;
