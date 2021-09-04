import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import OsuServer from '../../../../Osu!/Servers/OsuServer';
import OsuServers from '../../../../Osu!/Servers/OsuServers';
import CommandOption from '../CommandOption';
import OptionHelper from '../OptionHelper';
import OptionsTags from '../OptionsTags';

class OsuServerOption
  extends SlashCommandStringOption
  implements CommandOption
{
  tag: string = OptionsTags.osuServer;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('Your preffered osu! server');
  }

  public static getTag(interaction: CommandInteraction): OsuServer {
    const serverString = interaction.options.getString(OptionsTags.osuServer);
    return OsuServers.getFromString(serverString);
  }
}

export default OsuServerOption;
