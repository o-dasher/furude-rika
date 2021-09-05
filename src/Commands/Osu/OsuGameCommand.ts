import { CommandInteraction } from 'discord.js';
import DBManager from '../../DB/DBManager';
import OsuServerOption from '../../DiscordClasses/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../DiscordClasses/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import UserOption from '../../DiscordClasses/SlashCommands/SlashOptions/UserOption';
import CommandABC from '../CommandABC';
import IOsuParams from './IOsuParams';

abstract class OsuGameCommand extends CommandABC {
  protected constructor() {
    super();
    this.addStringOption(new OsuUserOption());
    this.addUserOption(new UserOption());
    this.addStringOption(new OsuServerOption());
  }

  protected async getOsuParams(
    interaction: CommandInteraction
  ): Promise<IOsuParams> {
    const runnerData = await DBManager.getUserData(interaction.user);
    const server = OsuServerOption.getTag(interaction, runnerData);
    const discordUser = UserOption.getTag(interaction);

    let pickedUserData = runnerData;
    if (discordUser) {
      pickedUserData = await DBManager.getUserData(discordUser);
    }

    const osuUser = await OsuUserOption.getTag(
      interaction,
      server,
      pickedUserData
    );

    return {
      osuUser,
      server
    };
  }
}

export default OsuGameCommand;
