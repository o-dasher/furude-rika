import BotEmbed from '@discord-classes/Embed/BotEmbed';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';
import DBGuild from '@furude-db/DBGuild';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction } from 'discord.js';

class TrackList extends SubCommand {
  public constructor() {
    super();
    this.setName('list').setDescription(
      'Lists all currently tracked users in this guild'
    );
  }
  async run(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guildId) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.guildOnlyCommand)
        )
      );
      return;
    }

    const doc = FurudeDB.db()
      .collection(DBPaths.guilds)
      .doc(interaction.guildId);

    const guild = Object.assign(new DBGuild(), (await doc.get()).data());
    const embed = new BotEmbed().setTitle(
      `${interaction.guild?.name} tracked users...`
    );
    
    embed.description = '';
    if (guild.osu.tracks.length === 0) {
      embed.description += StringUtils.boldString(
        'Unfortunately this guild does not track any users...'
      );
    } else {
      for (const [i, track] of guild.osu.tracks.entries()) {
        embed.description += StringUtils.boldString(`${i + 1} - ${track.id}\n`);
      }
    }

    await interaction.reply({
      embeds: [embed]
    });
  }
}

export default TrackList;
