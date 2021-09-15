import { CommandInteraction } from 'discord.js';
import Command from '@discord-classes/SlashCommands/Command';
import OsuProfile from '@furude-subs/Osu/OsuProfile';
import OsuRecent from '@furude-subs/Osu/OsuRecent';
import OsuSet from '@furude-subs/Osu/OsuSet';
import OsuCalc from '@furude-subs/Osu/OsuCalc';
import DroidGroup from '@furude-subs/Osu/Groups/Droid/DroidGroup';
import OsuTrack from '@furude-subs/Osu/Groups/Track/OsuTrack';
import OsuTop from '@furude-subs/Osu/OsuTop';

class Osu extends Command {
  constructor() {
    super();
    this.setName('osu').setDescription('osu! related commands...');
    this.addSelfSubcommand(new OsuSet());
    this.addSelfSubcommand(new OsuProfile());
    this.addSelfSubcommand(new OsuRecent());
    this.addSelfSubcommand(new OsuCalc());
    this.addSelfSubcommand(new OsuTop());
    this.addSelfSubGroup(new DroidGroup());
    this.addSelfSubGroup(new OsuTrack());
  }
  async run(interaction: CommandInteraction) {
    await this.runSubCommand(interaction);
  }
}

export default {
  data: new Osu()
};
