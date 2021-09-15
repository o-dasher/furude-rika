import DBDroidUser from '@furude-db/DBDroidUser';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import OsuDroidUser from '@furude-osu/Users/OsuDroidUser';
import OsuUserHelper from '@furude-osu/Users/OsuUserHelper';
import consolaGlobalInstance from 'consola';
import Task from './Task';

interface droidDataTask {
  currentID: number;
}

class DroidDataDumper extends Task {
  public override name: string = 'droid_data_dumper';
  protected override sleepTime: number = 10000;
  private latestIDGrace = 300000;
  private firstValidUserID = 2417 - 1;

  protected override async onStart(): Promise<void> {
    const beforeSessionData: droidDataTask = ((
      await FurudeDB.db().collection(DBPaths.tasks).doc(this.name).get()
    ).data() as droidDataTask) ?? {
      currentID: this.firstValidUserID
    };
    let currentID = beforeSessionData.currentID;
    while (true) {
      currentID++;
      if (currentID < this.firstValidUserID + 1) {
        continue;
      }
      const user = await new OsuDroidUser().buildUser(currentID);
      if (OsuUserHelper.userExists(user)) {
        const dbUser: Partial<DBDroidUser> = {
          username: user.name!.toLowerCase()
        };
        await FurudeDB.db()
          .collection(DBPaths.droid_users)
          .doc(currentID.toString())
          .set(dbUser, { merge: true });
        await FurudeDB.db().collection(DBPaths.tasks).doc(this.name).set(
          {
            currentID
          },
          { merge: true }
        );
        await this.sleep();
        consolaGlobalInstance.success(
          `Dumped osu!droid profile for ${user.name} at id: ${currentID}`
        );
      } else if (currentID > this.latestIDGrace) {
        currentID = this.firstValidUserID;
      }
    }
  }
}

export default DroidDataDumper;
