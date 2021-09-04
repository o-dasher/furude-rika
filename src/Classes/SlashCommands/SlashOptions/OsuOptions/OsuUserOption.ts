import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { User } from 'node-osu';
import ApiManager from '../../../../Osu!/API/ApiManager';
import Bancho from '../../../../Osu!/Servers/Bancho';
import OsuServer from '../../../../Osu!/Servers/OsuServer';
import CommandOption from '../CommandOption';
import OptionHelper from '../OptionHelper';
import OptionsTags from '../OptionsTags';

class OsuUserOption extends SlashCommandStringOption implements CommandOption {
  tag: string = OptionsTags.osuUser;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('The choosen osu! user');
  }

  public static async getTag(
    interaction: CommandInteraction,
    server: OsuServer
  ) {
    let osuUser: User = null;
    let username = interaction.options.getString(OptionsTags.osuUser);
    if (server instanceof Bancho) {
      try {
        osuUser = await ApiManager.banchoApi.getUser({ u: username });
      } catch (err) {}
    }
    if (osuUser == null) {
      await interaction.reply({
        ephemeral: true,
        content: `**Error trying to fetch ${username} from ${server.name}'s server**'`
      });
    }
    return osuUser;
  }
}

export default OsuUserOption;
