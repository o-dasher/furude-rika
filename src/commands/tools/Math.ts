import { CommandInteraction } from 'discord.js';
import ExpressionOption from '../../Classes/SlashCommands/SlashOptions/ExpressionOption';
import OptionsTags from '../../Classes/SlashCommands/SlashOptions/OptionsTags';
import CommandABC from '../../interfaces/CommandABC';
import { evaluate } from 'mathjs';
import i18next from 'i18next';
import LocalizeTags from '../../Localization/LocalizeTags';
import Localizer from '../../Localization/Localizer';

class Math extends CommandABC {
  constructor() {
    super();
    this.setName('math').setDescription('Evaluates a mathematical expression');
    this.addStringOption(new ExpressionOption().setRequired(true));
  }
  async run(interaction: CommandInteraction) {
    const expression = interaction.options.getString(
      OptionsTags.expression,
      true
    );

    let result = 0;
    try {
      result = evaluate(expression);
    } catch (err) {
      await interaction.reply(
        ` ** ${Localizer.getLocaleString(
          interaction,
          LocalizeTags.mathEvalError
        ).replace('EXPRESSION', expression)} **
        `
      );
      return;
    }

    await interaction.reply(
      `** ${Localizer.getLocaleString(interaction, LocalizeTags.mathReply)
        .replace('EXPRESSION', expression)
        .replace('RESULT', result.toString())} **
      `
    );
  }
}

export default {
  data: new Math()
};
