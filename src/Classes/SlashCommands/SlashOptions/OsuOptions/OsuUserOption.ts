import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import DBManager from '../../../../DB/DBManager';
import DBPaths from '../../../../DB/DBPaths';
import IDBUser from '../../../../DB/IDBUser';
import Bancho from '../../../../Osu!/Servers/Bancho';
import Droid from '../../../../Osu!/Servers/Droid';
import OsuServer from '../../../../Osu!/Servers/OsuServer';
import AbstractUser from '../../../../Osu!/Users/AbstractUser';
import BanchoUser from '../../../../Osu!/Users/BanchoUser';
import OsuDroidUser from '../../../../Osu!/Users/OsuDroidUser';
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
    server: OsuServer,
    userData: IDBUser
  ) {
    let osuUser: AbstractUser = null;
    let username =
      interaction.options.getString(OptionsTags.osuUser) ??
      userData.osu[server.name];

    if (server instanceof Bancho) {
      try {
        osuUser = await new BanchoUser().buildUser(username);
      } catch (err) {}
    } else if (server instanceof Droid) {
      osuUser = await new OsuDroidUser().buildUser(username);
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
