import { SlashCommandNumberOption } from '@discordjs/builders';
import CommandOption from './CommandOption';
import OptionHelper from './OptionHelper';
import OptionsTags from './OptionsTags';

class AmountOption extends SlashCommandNumberOption implements CommandOption {
  tag: string = OptionsTags.amount;

  public constructor() {
    super();
    OptionHelper.build(this);
  }
}

export default AmountOption;
