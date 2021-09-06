import { CommandInteraction } from 'discord.js';

import BotEmbed from '../../../DiscordClasses/Embed/BotEmbed';
import ModUtils from '../../../Osu!/Utils/ModUtils';
import OsuWithCalcCommand from './Utils/OsuWithCalcCommand';

class OsuRecent extends OsuWithCalcCommand {
  public constructor() {
    super();
    this.setName('recent').setDescription('Gets your recent osu! scores');
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const { scores, error } = await this.getScores(interaction, 0, 1);

    if (error) {
      return;
    }

    const score = scores![0];
    const modstr = ModUtils.getStringRepr(score.processedMods);

    let info = `Score: ${score!.score.toLocaleString(
      interaction.guild!.preferredLocale
    )}\nAccuracy: ${score!.accuracy}%\nCombo: ${score!.maxCombo} / ${
      score.beatmap.maxCombo
    }`;
    if (score.beatmap.exists && score.calcs) {
      info = info.concat(`\nPP: ${score.calcs?.total.toFixed(2)}`);
    }

    let title = `${score.beatmap.title} - [${score.beatmap.version}] +${modstr}`;
    if (score.beatmap.exists && score.calcs) {
      title = title.concat(` [${score.calcs.stars.total.toFixed(2)}★]`);
    }

    const embed = new BotEmbed(interaction)
      .setTitle(`**${title}**`)
      .setDescription(`**${info}**`)
      .setThumbnail(
        `https://b.ppy.sh/thumb/${score.beatmap!.beatmapSetId}l.jpg`
      );

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default OsuRecent;
