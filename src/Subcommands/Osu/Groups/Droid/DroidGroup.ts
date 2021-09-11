import SubCommandGroup from '@discord-classes/SlashCommands/SubCommandGroup';
import DroidSubmit from '@furude-subs/Osu/Groups/Droid/DroidSubmit';

class DroidGroup extends SubCommandGroup {
  public constructor() {
    super();
    this.setName('droid').setDescription('Osu!Droid specific commands');
    this.addSelfSubCommand(new DroidSubmit());
  }
}

export default DroidGroup;
