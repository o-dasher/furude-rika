import { SlashCommandUserOption } from '@discordjs/builders';
import CommandOption from './CommandOption';
import OptionHelper from './OptionHelper';
import OptionsTags from './OptionsTags';

class UserOption extends SlashCommandUserOption implements CommandOption {
  tag: string = OptionsTags.user;

  public constructor() {
    super();
    OptionHelper.build(this);
  }
}

export default UserOption;
