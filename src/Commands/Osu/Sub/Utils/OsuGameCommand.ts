import { CommandInteraction } from 'discord.js';
import DBManager from '@furude-db/DBManager';
import OsuServerOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import UserOption from '@discord-classes/SlashCommands/SlashOptions/UserOption';
import SubCommandABC from '@furude-commands/SubCommandABC';
import IOsuParams from '@furude-commands/Osu/Sub/Utils/IOsuParams';

abstract class OsuGameCommand extends SubCommandABC {
  protected constructor() {
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

    let pickedUserData = discordUser
      ? await DBManager.getUserData(discordUser)
      : runnerData;

    const osuUser = await OsuUserOption.getTag(
      interaction,
      server,
      pickedUserData
    );

    error = !osuUser;

    return {
      osuUser,
      server,
      error
    };
  }
}

export default OsuGameCommand;
