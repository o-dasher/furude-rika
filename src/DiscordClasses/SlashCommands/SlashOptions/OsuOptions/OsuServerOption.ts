import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import IDBUser from '../../../../DB/IDBUser';
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

  public static getTag(
    interaction: CommandInteraction,
    userData: IDBUser
  ): OsuServer {
    return this.getTagFromString(interaction, OptionsTags.osuServer, userData);
  }

  public static getTagFromString(
    interaction: CommandInteraction,
    tag: string,
    userData: IDBUser
  ): OsuServer {
    const serverString = interaction.options.getString(tag);
    return serverString
      ? OsuServers.getFromString(serverString)
      : OsuServers.getFromString(userData.osu.defaultServer);
  }
}

export default OsuServerOption;
