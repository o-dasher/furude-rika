import { CommandInteraction } from 'discord.js';
import i18next from 'i18next';
import CommandABC from '../interfaces/CommandABC';

class Ping extends CommandABC {
  constructor() {
    super();
    this.setName('ping');
    this.setDescription('Replies with pong!');
  }
  async run(interaction: CommandInteraction) {
    interaction.reply(
      i18next
        .t('ping')
        .replace(
          'PINGMS',
          (Date.now() - interaction.createdTimestamp).toString()
        )
        .replace('PINGAPIMS', Math.round(interaction.client.ws.ping).toString())
    );
  }
}

export default {
  data: new Ping()
};
