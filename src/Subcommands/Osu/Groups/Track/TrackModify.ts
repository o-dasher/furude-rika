import { CommandInteraction, Permissions } from 'discord.js';
import DBGuild from '@furude-db/DBGuild';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import OsuGameCommand from '@furude-subs/Osu/Utils/OsuGameCommand';
import StringUtils from '@furude-utils/StringUtils';
import { SlashCommandBooleanOption } from '@discordjs/builders';

class TrackAdd extends OsuGameCommand {
  public addOption: SlashCommandBooleanOption;

  public constructor() {
    super({});
    this.setName('modify')
      .setDescription('Adds a user to be tracked to this guild trackchannel')
      .addBooleanOption(
        (this.addOption = new SlashCommandBooleanOption()
          .setName('is_add')
          .setDescription(
            '(True & default) adds a tracked user, (False) removes a tracked user'
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

    const isAdd: boolean =
      interaction.options.getBoolean(this.addOption.name) ?? true;

    const osuParams = await this.getOsuParams(interaction);
    if (osuParams.error) {
      return;
    }
    const { osuUser, server } = osuParams;

    const trackChannelDB = FurudeDB.db()
      .collection(DBPaths.guilds)
      .doc(interaction.guildId);

    const guildInfo = (await trackChannelDB.get()).data() as DBGuild;

    if (!(guildInfo && guildInfo.osu && guildInfo.osu.trackChannelID)) {
      await interaction.editReply(
        StringUtils.errorString(
          'You first need to setup a channel for osu! tracking, to use this command'
        )
      );
      return;
    }

    guildInfo.osu.tracks = guildInfo.osu.tracks ?? [];
    if (isAdd) {
      if (!guildInfo.osu.tracks?.find((t) => t.id === osuUser?.id)) {
        guildInfo.osu.tracks?.push({
          id: osuUser!.id!,
          server: server.name
        });
      }
    } else {
      guildInfo.osu.tracks = guildInfo.osu.tracks.filter(
        (t) => t.id !== osuUser?.id
      );
    }

    await trackChannelDB.set(guildInfo, { merge: true });
    await interaction.editReply(
      StringUtils.successString(
        `Started tracking ${osuUser?.name} in this guild!`
      )
    );
  }
}

export default TrackAdd;
