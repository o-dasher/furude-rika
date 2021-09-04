import { CommandInteraction } from 'discord.js';
import i18next from 'i18next';
import CommandABC from '../../interfaces/CommandABC';
import LocalizeTags from '../../Localization/LocalizeTags';

class Ping extends CommandABC {
  constructor() {
    super();
    this.setName('ping').setDescription('Replies with pong!');
  }
  async run(interaction: CommandInteraction) {
    await interaction.reply(
      ` ** ${super
        .getLocaleString(interaction, LocalizeTags.pingReply)
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
