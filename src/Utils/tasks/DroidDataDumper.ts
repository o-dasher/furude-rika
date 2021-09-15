import DBDroidUser from '@furude-db/DBDroidUser';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import OsuDroidUser from '@furude-osu/Users/OsuDroidUser';
import OsuUserHelper from '@furude-osu/Users/OsuUserHelper';
import Task from './Task';

class DroidDataDumper extends Task {
  private latestIDGrace = 300000;
  private firstValidUserID = 2417 - 1;

  protected override async onStart(): Promise<void> {
    let currentID = this.firstValidUserID;
    while (true) {
      currentID++;
      if (currentID < this.firstValidUserID + 1) {
        continue;
      }
      const user = await new OsuDroidUser().buildUser(currentID);
      if (OsuUserHelper.userExists(user)) {
        const dbUser: Partial<DBDroidUser> = {
          username: user.name?.toLowerCase() ?? ''
        };
        await FurudeDB.db()
          .collection(DBPaths.droid_users)
          .doc(currentID.toString())
          .set(dbUser, { merge: true });
        console.log(currentID);
      } else if (currentID > this.latestIDGrace) {
        currentID = this.firstValidUserID;
      }
    }
  }
}

export default DroidDataDumper;
