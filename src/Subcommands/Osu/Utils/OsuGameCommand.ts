import { CommandInteraction } from 'discord.js';
import DBManager from '@furude-db/DBManager';
import OsuServerOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import UserOption from '@discord-classes/SlashCommands/SlashOptions/UserOption';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';
import IOsuParams from '@furude-subs/Osu/Utils/IOsuParams';

abstract class OsuGameCommand extends SubCommand {
  protected constructor(server?: boolean) {
    super();
    this.addStringOption(new OsuUserOption());
    this.addUserOption(new UserOption());
    this.addStringOption(new OsuServerOption());
  }

  protected async getOsuParams(
    interaction: CommandInteraction
  ): Promise<IOsuParams> {
    let error = false;

    const runnerData = await DBManager.getUserData(interaction.user);
    const server = OsuServerOption.getTag(interaction, runnerData);
    const discordUser = UserOption.getTag(interaction);
    const userData = discordUser
      ? await DBManager.getUserData(discordUser)
      : runnerData;

    const osuUser = await OsuUserOption.getTag(interaction, server, userData);

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
