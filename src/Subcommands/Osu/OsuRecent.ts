import { CommandInteraction } from 'discord.js';

import IndexOption from '@discord-classes/SlashCommands/SlashOptions/IndexOption';
import OsuWithCalcCommand from '@furude-subs/Osu/Utils/OsuWithCalcCommand';
import StringUtils from '@furude-utils/StringUtils';
import RecentScoreEmbed from '@discord-classes/Embed/RecentScoreEmbed';
import FastTS from '@furude-localization/FastTS';

class OsuRecent extends OsuWithCalcCommand {
  public constructor() {
    super({});
    this.setName('recent').setDescription('Gets your recent osu! scores');
    this.addNumberOption(new IndexOption().setDescription('The play index'));
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const index = IndexOption.getTag(interaction);
    const { server, osuUser, scores, error, indexFrom } = await this.getScores(
      interaction,
      index,
      0
    );

    if (error) {
      return;
    }

    const score = scores![indexFrom];
    const embed = new RecentScoreEmbed(score, interaction);

    await interaction.editReply({
      embeds: [embed],
      content: StringUtils.successString(
        FastTS.recentScore(osuUser, server, indexFrom)
      )
    });
  }
}

export default OsuRecent;
