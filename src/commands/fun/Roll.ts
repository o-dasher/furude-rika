import { SlashCommandNumberOption } from '@discordjs/builders';
import Command from '@discord-classes/SlashCommands/Command';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction } from 'discord.js';
import RandomHelper from '@furude-math/RandomHelper';
import StringUtils from '@furude-utils/StringUtils';

class Roll extends Command {
  public boundTag = 'bound';

  constructor() {
    super();
    this.setName('roll').setDescription(
      'Randomly picks a number within a certain bound'
    );
    this.addNumberOption(
      new SlashCommandNumberOption()
        .setName(this.boundTag)
        .setDescription('The bound number for the roll')
        .setRequired(true)
    );
  }
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const bound = interaction.options.getNumber(this.boundTag, true);
    const random = RandomHelper.getRandomInt(0, bound);
    await interaction.editReply(
      StringUtils.successString(
        Localizer.getLocaleString(interaction, LocalizeTags.rollReply).replace(
          'RANDOM',
          random.toString()
        )
      )
    );
  }
}

export default {
  data: new Roll()
};
