import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction, MessageActionRow } from 'discord.js';
import OsuGameCommand from './Utils/OsuGameCommand';

class OsuTop extends OsuGameCommand {
  public constructor() {
    super({});
    this.setName('top').setDescription('Shows a osu! player top plays!');
  }
  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    const { osuUser } = await this.getOsuParams(interaction);
    const topScores = await osuUser?.getBests();
    await interaction.editReply(StringUtils.errorString('WIP'));
  }
}

export default OsuTop;
