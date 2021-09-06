import { CommandInteraction } from 'discord.js';
import DBManager from '../../../../DB/DBManager';
import OsuServerOption from '../../../../DiscordClasses/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../../../DiscordClasses/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import UserOption from '../../../../DiscordClasses/SlashCommands/SlashOptions/UserOption';
import SubCommandABC from '../../../SubCommandABC';
import IOsuParams from './IOsuParams';

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
