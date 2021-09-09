import { CommandInteraction } from 'discord.js';
import CommandABC from '@discord-classes/SlashCommands/CommandABC';
import OsuProfile from '@furude-subs/Osu/OsuProfile';
import OsuRecent from '@furude-subs/Osu/OsuRecent';
import OsuSet from '@furude-subs/Osu/OsuSet';
import OsuCalc from '@furude-subs/Osu/OsuCalc';

class Osu extends CommandABC {
  constructor() {
    super();
    this.setName('osu').setDescription('osu! related commands...');
    this.addSelfSubcommand(new OsuSet());
    this.addSelfSubcommand(new OsuProfile());
    this.addSelfSubcommand(new OsuRecent());
    this.addSelfSubcommand(new OsuCalc());
  }
  async run(interaction: CommandInteraction) {
    const subCommandString = interaction.options.getSubcommand(true);
    this.getSubcommand(subCommandString).run(interaction);
  }
}

export default {
  data: new Osu()
};
