import { CommandInteraction } from 'discord.js';
import {
  DroidPerformanceCalculator,
  OsuPerformanceCalculator,
  Parser
} from 'osu-droid';
import Droid from '../../../../Osu!/Servers/Droid';
import IOSuWithCalc from './IOsuWithCalc';
import OsuGameCommand from './OsuGameCommand';

abstract class OsuWithCalcCommand extends OsuGameCommand {
  override async getOsuParams(
    interaction: CommandInteraction
  ): Promise<IOSuWithCalc> {
    const { osuUser, server } = await super.getOsuParams(interaction);
    return {
      osuUser,
      server,
      calculator:
        server instanceof Droid
          ? new DroidPerformanceCalculator()
          : new OsuPerformanceCalculator(),
      osuParser: new Parser()
    };
  }
}

export default OsuWithCalcCommand;
