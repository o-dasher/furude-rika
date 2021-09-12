import { SlashCommandStringOption } from '@discordjs/builders';

import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuUser from '@furude-osu/Users/OsuUser';
import OsuUserHelper from '@furude-osu/Users/OsuUserHelper';
import { CommandInteraction } from 'discord.js';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';
import OptionHelper from '@discord-classes/SlashCommands/SlashOptions/OptionHelper';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import StringUtils from '@furude-utils/StringUtils';
import DBUser from '@furude-db/DBUser';

class OsuUserOption extends SlashCommandStringOption implements CommandOption {
  tag: string = OptionsTags.osuUser;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('The choosen osu! user');
  }

  public static async getTag(
    interaction: CommandInteraction,
    server: OsuServer,
    userData: DBUser,
    limit?: number
  ) {
    let osuUser: OsuUser | null = null;
    let usernameOrID: string | null = interaction.options.getString(
      OptionsTags.osuUser
    );

    if (!usernameOrID) {
      usernameOrID = userData.getUserName(server);
      if (!usernameOrID) {
        await interaction.editReply(
          StringUtils.errorString(
            Localizer.getLocaleString(
              interaction,
              LocalizeTags.osuSetRequired
            ).replace('SERVER', server.name)
          )
        );
        return;
      }
    }

    osuUser = await OsuUserHelper.getUserFromServer(
      usernameOrID,
      server,
      interaction,
      userData,
      limit
    );

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
