import { CommandInteraction } from 'discord.js';
import CommandABC from '../CommandABC';
import OsuProfile from './sub/OsuProfile';
import OsuRecent from './Sub/OsuRecent';
import OsuSet from './sub/OsuSet';

class Osu extends CommandABC {
  constructor() {
    super();
    this.setName('osu').setDescription('osu! related commands...');
    this.addSelfSubcommand(new OsuSet());
    this.addSelfSubcommand(new OsuProfile());
    this.addSelfSubcommand(new OsuRecent());
  }
  async run(interaction: CommandInteraction) {
    const subCommandString = interaction.options.getSubcommand(true);
    this.getSubcommand(subCommandString).run(interaction);
  }
}

export default {
  data: new Osu()
};
