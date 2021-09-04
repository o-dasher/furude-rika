import { CommandInteraction } from 'discord.js';
import OsuServerOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import SubCommandABC from '../../../interfaces/SubCommandABC';

class Profile extends SubCommandABC {
  constructor() {
    super();
    this.setName('profile').setDescription(
      "Views yours or someone's osu! profile"
    );
    this.addStringOption(new OsuUserOption().setRequired(true));
    this.addStringOption(new OsuServerOption().setRequired(true));
  }
  async run(interaction: CommandInteraction) {
    const user = OsuServerOption.getTag(interaction);
    const server = OsuServerOption.getTag(interaction);
  }
}

export default Profile;
