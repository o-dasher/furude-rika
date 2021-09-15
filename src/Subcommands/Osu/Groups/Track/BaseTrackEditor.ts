import DBGuild from '@furude-db/DBGuild';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import OsuGameCommand from '@furude-subs/Osu/Utils/OsuGameCommand';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction, Permissions } from 'discord.js';

class BaseTrackEditor extends OsuGameCommand {
  private isAdd: Boolean;
  private trackLimit: number = 25;

  public constructor(isAdd: boolean) {
    super({});
    this.isAdd = isAdd;
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

    const osuParams = await this.getOsuParams(interaction, {
      needsExtraInfo: false
    });
    if (osuParams.error) {
      return;
    }
    const { osuUser, server } = osuParams;

    const trackChannelDB = FurudeDB.db()
      .collection(DBPaths.guilds)
      .doc(interaction.guildId);

    const guildInfo = Object.assign(
      new DBGuild(),
      (await trackChannelDB.get()).data()
    );

    if (this.isAdd) {
      if (guildInfo.osu!.tracks!.find((t) => t.id === osuUser?.id)) {
        await interaction.editReply(
          StringUtils.errorString(
            `${osuUser?.name} is already being tracked on this guild`
          )
        );
        return;
      } else {
        if (guildInfo.osu!.tracks!.length >= this.trackLimit) {
          await interaction.editReply(
            StringUtils.errorString(
              `I am sorry but you can track at max ${this.trackLimit} per guild`
            )
          );
          return;
        } else {
          guildInfo.osu.tracks!.push({
            id: osuUser!.id!,
            server: server.name
          });
        }
      }
    } else {
      guildInfo.osu.tracks = guildInfo.osu!.tracks!.filter(
        (t) => t.id !== osuUser?.id
      );
    }

    await trackChannelDB.set(JSON.parse(JSON.stringify(guildInfo)), {
      merge: true
    });

    await interaction.editReply(
      StringUtils.successString(
        this.isAdd
          ? `Started tracking ${osuUser?.name} in this guild!`
          : `Removed ${osuUser?.name} from being tracked in this guild!`
      )
    );
  }
}

export default BaseTrackEditor;
