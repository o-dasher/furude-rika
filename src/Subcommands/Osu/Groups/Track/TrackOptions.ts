import BotEmbed from '@discord-classes/Embed/BotEmbed';
import ChannelOption from '@discord-classes/SlashCommands/SlashOptions/ChannelOption';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';
import {
  SlashCommandChannelOption,
  SlashCommandIntegerOption
} from '@discordjs/builders';
import DBGuild from '@furude-db/DBGuild';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction, Permissions } from 'discord.js';

class TrackOptions extends SubCommand {
  private minPP: SlashCommandIntegerOption;
  private mainChannel: SlashCommandChannelOption;
  private leaderboardChannel: SlashCommandChannelOption;

  public constructor() {
    super();
    this.setName('options')
      .setDescription('Options and filters for osu! tracking')
      .addIntegerOption(
        (this.minPP = new SlashCommandIntegerOption()
          .setName('min_pp')
          .setDescription('Minimum pp required for score to be tracked.'))
      )
      .addChannelOption(
        (this.mainChannel = new SlashCommandChannelOption()
          .setName('main_channel')
          .setDescription('The main channel for tracking users'))
      )
      .addChannelOption(
        (this.leaderboardChannel = new SlashCommandChannelOption()
          .setName('leaderboard_channel')
          .setDescription(
            'Channel to display a pp rank based on the tracked users.'
          ))
      );
    this.permissions.push(Permissions.FLAGS.ADMINISTRATOR);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    if (!(await this.ensureUsage(interaction))) {
      return;
    }

    if (!interaction.guildId) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.guildOnlyCommand)
        )
      );
      return;
    }

    const minPP = interaction.options.getInteger(this.minPP.name);
    const mainChannel = interaction.options.getChannel(this.mainChannel.name);
    const leaderboardChannel = interaction.options.getChannel(
      this.leaderboardChannel.name
    );

    const doc = FurudeDB.db()
      .collection(DBPaths.guilds)
      .doc(interaction.guildId);

    const guild: DBGuild = Object.assign(
      new DBGuild(),
      (await doc.get()).data()
    );

    guild.osu.minPP = minPP ?? guild.osu.minPP;
    guild.osu.trackChannelID =
      mainChannel?.type === 'GUILD_TEXT'
        ? mainChannel.id
        : guild.osu.trackChannelID;
    guild.osu.leaderboardChannelID =
      leaderboardChannel?.type === 'GUILD_TEXT'
        ? leaderboardChannel.id
        : guild.osu.leaderboardChannelID;

    await doc.set(JSON.parse(JSON.stringify(guild)), { merge: true });
    const embed = new BotEmbed(interaction);

    const options = {
      minPP: guild.osu.minPP,
      trackChannelID: guild.osu.trackChannelID,
      leaderboardChannelID: guild.osu.leaderboardChannelID
    };

    let description = StringUtils.objectToKeyValueString(options);
    embed.setDescription(
      StringUtils.blockQuote(StringUtils.boldString(description))
    );

    await interaction.editReply({
      content: StringUtils.successString(
        `Alright updated tracking options for your guild!`
      ),
      embeds: [embed]
    });
  }
}

export default TrackOptions;
