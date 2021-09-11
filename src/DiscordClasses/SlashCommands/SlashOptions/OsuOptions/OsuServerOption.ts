import { SlashCommandStringOption } from '@discordjs/builders';
import DBUser from '@furude-db/DBUser';
import OsuServer from '@furude-osu/Servers/OsuServer';
import OsuServers from '@furude-osu/Servers/OsuServers';
import { CommandInteraction } from 'discord.js';
import CommandOption from '@discord-classes/SlashCommands/SlashOptions/CommandOption';
import OptionHelper from '@discord-classes/SlashCommands/SlashOptions/OptionHelper';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';

class OsuServerOption
  extends SlashCommandStringOption
  implements CommandOption
{
  tag: string = OptionsTags.osuServer;

  public constructor() {
    super();
    OptionHelper.build(this).setDescription('Your prefered osu! server');
    for (const server of OsuServers.servers) {
      this.addChoice(server.name, server.name);
    }
  }

  public static getTag(
    interaction: CommandInteraction,
    userData: DBUser
  ): OsuServer {
    return this.getTagFromString(interaction, OptionsTags.osuServer, userData);
  }

  public static getTagFromString(
    interaction: CommandInteraction,
    tag: string,
    userData?: DBUser
  ): OsuServer {
    const serverString = interaction.options.getString(tag);
    return OsuServers.getFromString(
      serverString
        ? serverString
        : userData && userData.osu && userData.osu.defaultServer
        ? userData.osu.defaultServer
        : OsuServers.bancho.name
    );
  }
}

export default OsuServerOption;
