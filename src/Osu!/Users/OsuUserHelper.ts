import DBUser from '@furude-db/DBUser';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuServers from '@furude-osu/Servers/OsuServers';
import OsuUser from '@furude-osu/Users/OsuUser';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction } from 'discord.js';
import BanchoUser from './BanchoUser';
import OsuDroidUser from './OsuDroidUser';

interface UserRes {
  err: boolean;
  osuUser: OsuUser | null;
}

class OsuUserHelper {
  public static userExists(osuUser: OsuUser): boolean {
    return osuUser != null && osuUser.name != '';
  }
  public static async getUserFromServer(
    id: string | number,
    server: OsuServer,
    interaction?: CommandInteraction,
    userData?: DBUser,
    limit?: number
  ): Promise<UserRes> {
    let res: UserRes = {
      err: false,
      osuUser: null
    };
    if (server === OsuServers.bancho) {
      try {
        res.osuUser = await new BanchoUser().buildUser(id);
      } catch (err) {}
    } else if (server === OsuServers.droid) {
      id = parseInt(id.toString());
      if (!id && interaction) {
        await interaction.editReply(
          StringUtils.errorString(
            Localizer.getLocaleString(
              interaction,
              LocalizeTags.droidUserMustBeID
            )
          )
        );
        res.err = true;
        return res;
      } else {
        res.osuUser = await new OsuDroidUser().buildUser(id, userData, limit);
      }
    }
    return res;
  }
}

export default OsuUserHelper;
