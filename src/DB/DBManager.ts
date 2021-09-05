import { CommandInteraction, User } from 'discord.js';
import { firestore } from 'firebase-admin';
import UserOption from '../DiscordClasses/SlashCommands/SlashOptions/UserOption';
import OsuServers from '../Osu!/Servers/OsuServers';
import DBPaths from './DBPaths';
import IDBUser from './IDBUser';

class DBManager {
  private constructor() {}

  public static furudeDB: firestore.Firestore;

  public static init() {
    this.furudeDB = firestore();
  }

  public static async getUserData(discordUser: User): Promise<IDBUser> {
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
        .doc(discordUser.id)
        .get()
    ).data();
    Object.assign(user, currentData);
    return user;
  }
}

export default DBManager;
