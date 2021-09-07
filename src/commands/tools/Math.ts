import ExpressionOption from '@discord-classes/SlashCommands/SlashOptions/ExpressionOption';
import CommandABC from '@furude-commands/CommandABC';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction } from 'discord.js';
import { evaluate, MathExpression } from 'mathjs';

class Math extends CommandABC {
  constructor() {
    super();
    this.setName('math').setDescription('Evaluates a mathematical expression');
    this.addStringOption(new ExpressionOption().setRequired(true));
  }
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();

    const expression: MathExpression =
      ExpressionOption.getTag(interaction) ?? '';

    let cantSolve = expression == '';
    let result = 0;

    try {
      result = evaluate(expression);
    } catch (err) {
      cantSolve = true;
    }

    if (cantSolve) {
      await interaction.reply(
        ` ** ${Localizer.getLocaleString(
          interaction,
          LocalizeTags.mathEvalError
        ).replace('EXPRESSION', expression)} **
        `
      );
      return;
    }

    await interaction.editReply(
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
