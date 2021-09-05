import { CommandInteraction } from 'discord.js';
import { firestore } from 'firebase-admin';
import OsuServers from '../Osu!/Servers/OsuServers';
import DBPaths from './DBPaths';
import IDBUser from './IDBUser';

class DBManager {
  private constructor() {}

  public static furudeDB: firestore.Firestore;

  public static init() {
    this.furudeDB = firestore();
  }

  public static async getUserData(
    interaction: CommandInteraction
  ): Promise<IDBUser> {
    const user: IDBUser = {
      osu: {
        defaultServer: OsuServers.bancho.name,
        bancho: null,
        droid: null
      }
    };
    const currentData = (
      await DBManager.furudeDB
        .collection(DBPaths.users)
        .doc(interaction.user.id)
        .get()
    ).data();
    Object.assign(user, currentData);
    return user;
  }
}

export default DBManager;
