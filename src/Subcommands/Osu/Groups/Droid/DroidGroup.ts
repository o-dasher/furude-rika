import SubCommandGroup from '@discord-classes/SlashCommands/SubCommandGroup';
import Submit from '@furude-subs/Osu/Groups/Droid/Submit';

class DroidGroup extends SubCommandGroup {
  public constructor() {
    super();
    this.setName('droid').setDescription('Osu!Droid specific commands');
    this.addSelfSubCommand(new Submit());
  }
}

export default DroidGroup;
