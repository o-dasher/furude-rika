import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import IDBUser from '../../../../DB/IDBUser';
import Localizer from '../../../../Localization/Localizer';
import LocalizeTags from '../../../../Localization/LocalizeTags';
import Bancho from '../../../../Osu!/Servers/Bancho';
import Droid from '../../../../Osu!/Servers/Droid';
import OsuServer from '../../../../Osu!/Servers/OsuServer';
import AbstractUser from '../../../../Osu!/Users/AbstractUser';
import BanchoUser from '../../../../Osu!/Users/BanchoUser';
import OsuDroidUser from '../../../../Osu!/Users/OsuDroidUser';
import OsuUserHelper from '../../../../Osu!/Users/OsuUserHelper';
import CommandOption from '../CommandOption';
import OptionHelper from '../OptionHelper';
import OptionsTags from '../OptionsTags';

class OsuUserOption extends SlashCommandStringOption implements CommandOption {
  tag: string = OptionsTags.osuUser;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('The choosen osu! user');
  }

  public static async getTag(
    interaction: CommandInteraction,
    server: OsuServer,
    userData: IDBUser
  ) {
    let osuUser: AbstractUser = null;
    let username =
      interaction.options.getString(OptionsTags.osuUser) ??
      userData.osu[server.name];

    if (server instanceof Bancho) {
      try {
        osuUser = await new BanchoUser().buildUser(username);
      } catch (err) {}
    } else if (server instanceof Droid) {
      if (isNaN(username)) {
        await interaction.editReply(
          `**${Localizer.getLocaleString(
            interaction,
            LocalizeTags.droidUserMustBeID
          )}**`
        );
        return;
      } else {
        osuUser = await new OsuDroidUser().buildUser(username);
      }
    }

    if (!OsuUserHelper.userExists(osuUser)) {
      osuUser = null;
      await interaction.editReply(
        `**${Localizer.getLocaleString(
          interaction,
          LocalizeTags.osuUserFetchError
        )
          .replace('USER', username)
          .replace('SERVER', server.name)}**`
      );
      return;
    }

    return osuUser;
  }
}

export default OsuUserOption;
