import BotEmbed from '@discord-classes/Embed/BotEmbed';
import SubCommand from '@discord-classes/SlashCommands/SubCommand';
import { SlashCommandIntegerOption } from '@discordjs/builders';
import { DBGUildOsu } from '@furude-db/DBGuild';
import DBPaths from '@furude-db/DBPaths';
import FurudeDB from '@furude-db/FurudeDB';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction, Permissions } from 'discord.js';

class TrackOptions extends SubCommand {
  private minPP: SlashCommandIntegerOption;

  public constructor() {
    super();
    this.setName('options')
      .setDescription('Options and filters for osu! tracking')
      .addIntegerOption(
        (this.minPP = new SlashCommandIntegerOption()
          .setName('min_pp')
          .setDescription(
            'Minimum pp required for score to be tracked.'
          )).setRequired(true)
      );

    this.permissions.push(Permissions.FLAGS.ADMINISTRATOR);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    if (!(await this.ensureUsage(interaction))) {
      return;
    }

    const minPP = interaction.options.getInteger(this.minPP.name, true);

    if (!interaction.guildId) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.guildOnlyCommand)
        )
      );
      return;
    }

    const data: DBGUildOsu = {
      minPP
    };

    await FurudeDB.db()
      .collection(DBPaths.guilds)
      .doc(interaction.guildId)
      .set(data, { merge: true });

    const options = {
      minPP
    };

    const embed = new BotEmbed(interaction);

    let description = '';
    for (const option in options) {
      description = description.concat(
        `${option}: ${(options as Record<string, any>)[option]}`
      );
    }

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
