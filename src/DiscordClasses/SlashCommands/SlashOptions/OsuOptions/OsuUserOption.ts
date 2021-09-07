import { SlashCommandStringOption } from '@discordjs/builders';
import DBUserHelper from '@furude-db/DBUserHelper';
import IDBUser from '@furude-db/IDBUser';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import Bancho from '@furude-osu/Servers/Bancho';
import Droid from '@furude-osu/Servers/Droid';
import OsuServer from '@furude-osu/Servers/OsuServer';
import AbstractUser from '@furude-osu/Users/AbstractUser';
import BanchoUser from '@furude-osu/Users/BanchoUser';
import OsuDroidUser from '@furude-osu/Users/OsuDroidUser';
import OsuUserHelper from '@furude-osu/Users/OsuUserHelper';
import { CommandInteraction } from 'discord.js';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';
import OptionHelper from '@discord-classes/SlashCommands/SlashOptions/OptionHelper';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import StringUtils from '@furude-utils/StringUtils';

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
    let osuUser: AbstractUser | null = null;
    let usernameOrID: string | null = interaction.options.getString(
      OptionsTags.osuUser
    );

    if (!usernameOrID) {
      usernameOrID = DBUserHelper.getUserName(userData, server);
      if (!usernameOrID) {
        await interaction.editReply(
          StringUtils.errorString(
            `You or the specified user does not have a linked osu account on ${server.name}`
          )
        );
        return;
      }
    }

    if (server instanceof Bancho) {
      try {
        osuUser = await new BanchoUser().buildUser(usernameOrID);
      } catch (err) {}
    } else if (server instanceof Droid) {
      const id = parseInt(usernameOrID);
      if (!id) {
        await interaction.editReply(
          StringUtils.errorString(
            Localizer.getLocaleString(
              interaction,
              LocalizeTags.droidUserMustBeID
            )
          )
        );
        return;
      } else {
        osuUser = await new OsuDroidUser().buildUser(usernameOrID);
      }
    }

    if (!osuUser || !OsuUserHelper.userExists(osuUser)) {
      osuUser = null;
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.osuUserFetchError)
            .replace('USER', usernameOrID)
            .replace('SERVER', server.name)
        )
      );
      return;
    }

    return osuUser;
  }
}

export default OsuUserOption;
