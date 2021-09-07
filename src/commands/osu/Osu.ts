import { CommandInteraction } from 'discord.js';
import CommandABC from '@furude-commands/CommandABC';
import OsuProfile from '@furude-commands/Osu/Sub/OsuProfile';
import OsuRecent from '@furude-commands/Osu/Sub/OsuRecent';
import OsuSet from '@furude-commands/Osu/Sub/OsuSet';

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
