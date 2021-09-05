import { SlashCommandNumberOption } from '@discordjs/builders';
import consolaGlobalInstance from 'consola';
import { CommandInteraction } from 'discord.js';
import { boolean } from 'mathjs';
import BotEmbed from '../../../DiscordClasses/Embed/BotEmbed';
import ApiManager from '../../../Osu!/API/ApiManager';
import Droid from '../../../Osu!/Servers/Droid';
import AbstractScore from '../../../Osu!/Users/score/AbstractScore';
import OsuGameCommand from './Utils/OsuGameCommand';

class OsuRecent extends OsuGameCommand {
  public constructor() {
    super();
    this.setName('recent').setDescription('Gets your recent osu! scores');
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const { osuUser, server } = await this.getOsuParams(interaction);

    let scores: AbstractScore[] = [];

    try {
      scores = await osuUser.getScores();
    } catch (err) {
      consolaGlobalInstance.error(err);
    }

    const hasRecent = scores.length !== 0;

    if (!hasRecent) {
      await interaction.editReply(
        `**${osuUser.name} doesn't have any recent plays!**`
      );
      return;
    }

    const score = scores[0];

    const beatmap = !(server instanceof Droid)
      ? score.beatmap
      : (await ApiManager.banchoApi.getBeatmaps({ h: score.beatmap.hash }))[0];

    const embed = new BotEmbed(interaction)
      .setTitle(`${beatmap.title} - [${beatmap.version}] +${score.mods}`)
      .setDescription(
        `**Score: ${score.score.toLocaleString(
          interaction.guild.preferredLocale
        )}\nAccuracy: ${score.accuracy}%\nCombo: ${score.maxCombo}**`
      );

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default OsuRecent;
