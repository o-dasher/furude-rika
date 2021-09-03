
import { CommandInteraction } from 'discord.js';
import CommandABC from '../interfaces/CommandABC';

class Ping extends CommandABC {
  public constructor() {
    super();
    this.setName('ping');
    this.setDescription('Replies with pong!');
  }
  async run(interaction: CommandInteraction) {
    interaction.reply('pong!');
  }
}

export default {
  data: new Ping()
};
