import { CommandInteraction } from 'discord.js';
import {
  OsuPerformanceCalculator,
  DroidPerformanceCalculator,
  Parser
} from 'osu-droid';
import DBManager from '../../../../DB/DBManager';
import OsuServerOption from '../../../../DiscordClasses/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../../../DiscordClasses/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import UserOption from '../../../../DiscordClasses/SlashCommands/SlashOptions/UserOption';
import Droid from '../../../../Osu!/Servers/Droid';
import SubCommandABC from '../../../SubCommandABC';
import IOsuParams from './IOsuParams';

abstract class OsuGameCommand extends SubCommandABC {
  protected osuParser = new Parser();
  protected osuCalculator = new OsuPerformanceCalculator();
  protected droidCalculator = new DroidPerformanceCalculator();

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

    const calculator =
      server instanceof Droid ? this.droidCalculator : this.osuCalculator;

    let pickedUserData = discordUser
      ? await DBManager.getUserData(discordUser)
      : runnerData;

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
