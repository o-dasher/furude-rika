import { CommandInteraction } from 'discord.js';
import CommandABC from '../CommandABC';
import Localizer from '../../Localization/Localizer';
import LocalizeTags from '../../Localization/LocalizeTags';

class Ping extends CommandABC {
  constructor() {
    super();
    this.setName('ping').setDescription('Replies with pong!');
  }
  async run(interaction: CommandInteraction) {
    await interaction.reply(
      ` ** ${Localizer.getLocaleString(interaction, LocalizeTags.pingReply)
        .replace(
          'PINGMS',
          (Date.now() - interaction.createdTimestamp).toString()
        )
        .replace(
          'PINGAPIMS',
          Math.round(interaction.client.ws.ping).toString()
        )} ** `
    );
  }
}

export default {
  data: new Ping()
};
