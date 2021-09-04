import { CommandInteraction } from 'discord.js';
import SubCommandABC from '../../../interfaces/SubCommandABC';

class Profile extends SubCommandABC {
  constructor() {
    super();
    this.setName('profile').setDescription(
      "Views yours or someone's osu! profile"
    );
  }
  run(interaction: CommandInteraction): void {
    
  }
}

export default Profile;
