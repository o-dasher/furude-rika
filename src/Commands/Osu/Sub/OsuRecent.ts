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

    const { calculator, score, apiBeatmap, mapExists, error, mods } =
      await this.getOsuParams(interaction);

    if (error) {
      return;
    }

    const modstr = ModUtils.getStringRepr(mods);

    let info = `Score: ${score!.score.toLocaleString(
      interaction.guild!.preferredLocale
    )}\nAccuracy: ${score!.accuracy}%\nCombo: ${score!.maxCombo} / ${
      apiBeatmap!.maxCombo
    }`;
    if (mapExists) {
      info = info.concat(`\nPP: ${calculator.total.toFixed(2)}`);
    }

    let title = `${apiBeatmap!.title} - [${apiBeatmap!.version}] +${modstr}`;
    if (mapExists) {
      title = title.concat(` [${calculator.stars.total.toFixed(2)}★]`);
    }

    const embed = new BotEmbed(interaction)
      .setTitle(`**${title}**`)
      .setDescription(`**${info}**`)
      .setThumbnail(`https://b.ppy.sh/thumb/${apiBeatmap!.beatmapSetId}l.jpg`);

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default OsuRecent;
