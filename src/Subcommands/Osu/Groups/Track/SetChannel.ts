import ChannelOption from '@discord-classes/SlashCommands/SlashOptions/ChannelOption';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';
import DBGuild from '@furude-db/DBGuild';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction, Permissions } from 'discord.js';

class SetChannel extends SubCommand {
  public constructor() {
    super();
    this.setName('channel').setDescription('Sets the guild tracking channel');
    this.addChannelOption(new ChannelOption().setRequired(true));
    this.permissions.push(Permissions.FLAGS.ADMINISTRATOR);
  }

  public async run(interaction: CommandInteraction): Promise<void> {
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

    const channel = ChannelOption.getTag(interaction);

    if (channel?.type !== 'GUILD_TEXT') {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.wrongChannelType)
        )
      );
      return;
    }

    const data: DBGuild = {
      osu: {
        trackChannelID: channel!.id
      }
    };

    await FurudeDB.db()
      .collection(DBPaths.guilds)
      .doc(interaction.guildId)
      .set(data, { merge: true });

    await interaction.editReply(
      StringUtils.successString(
        `${channel} was set as this guild osu! track channel`
      )
    );
  }
}

export default SetChannel;
