import { SlashCommandStringOption } from '@discordjs/builders';
import CommandOption from './CommandOption';
import OptionHelper from './OptionHelper';
import OptionsTags from './OptionsTags';

class ExpressionOption
  extends SlashCommandStringOption
  implements CommandOption
{
  tag: string = OptionsTags.expression;

  public constructor() {
    super();
    OptionHelper.build(this);
    this.setDescription('A mathematical expression.');
  }
}

export default ExpressionOption;
