import SubCommandGroup from '@discord-classes/SlashCommands/SubCommandGroup';
import SetChannel from '@furude-subs/Osu/Groups/Track/SetChannel';
import TrackAdd from '@furude-subs/Osu/Groups/Track/TrackModify';

class OsuTrack extends SubCommandGroup {
  public constructor() {
    super();
    this.setName('track').setDescription('osu! tracking commands!');
    this.addSelfSubCommand(new SetChannel());
    this.addSelfSubCommand(new TrackAdd());
  }
}

export default OsuTrack;
