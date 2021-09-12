import { CommandInteraction } from 'discord.js';
import FurudeDB from '@furude-db/FurudeDB';
import OsuServerOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import UserOption from '@discord-classes/SlashCommands/SlashOptions/UserOption';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';
import OsuServer from '@furude-osu/Servers/OsuServer';
import IOsuParams from '@furude-subs/Osu/Utils/IOsuParams';

abstract class OsuGameCommand extends SubCommand {
  protected constructor(params: {
    osuUser?: boolean;
    user?: boolean;
    server?: boolean;
  }) {
    super();
    let { osuUser, user, server } = params;

    osuUser = typeof osuUser === 'undefined' ? true : osuUser;
    user = typeof user === 'undefined' ? true : user;
    server = typeof server === 'undefined' ? true : server;

    if (osuUser) {
      this.addStringOption(new OsuUserOption());
    }
    if (user) {
      this.addUserOption(new UserOption());
    }
    if (server) {
      {
        this.addStringOption(new OsuServerOption());
      }
    }
  }

  protected async getOsuParams(
    interaction: CommandInteraction,
    options?: {
      server?: OsuServer;
      limit?: number;
    }
  ): Promise<IOsuParams> {
    let error = false;
    let server: OsuServer | undefined;
    let limit: number | undefined;

    if (options) {
      server = options.server ?? undefined;
      limit = options.limit ?? undefined;
    }

    const runnerData = await FurudeDB.getUserData(interaction.user);
    server = server ?? OsuServerOption.getTag(interaction, runnerData);
    const discordUser = UserOption.getTag(interaction);
    const userData = discordUser
      ? await FurudeDB.getUserData(discordUser)
      : runnerData;

    const osuUser = await OsuUserOption.getTag(
      interaction,
      server,
      userData,
      limit
    );
    error = !osuUser;

    return {
      osuUser,
      server,
      userData,
      error
    };
  }
}

export default OsuGameCommand;
