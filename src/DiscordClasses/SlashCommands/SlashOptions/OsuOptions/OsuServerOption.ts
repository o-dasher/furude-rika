import { SlashCommandStringOption } from '@discordjs/builders';
import IDBUser from '@furude-db/IDBUser';
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
    OptionHelper.build(this).setDescription('Your preffered osu! server');
    for (const server of OsuServers.servers) {
      this.addChoice('server', server.name);
    }
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
