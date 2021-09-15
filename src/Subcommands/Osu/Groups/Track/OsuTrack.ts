import SubCommandGroup from '@discord-classes/SlashCommands/SubCommandGroup';
import SetChannel from './SetChannel';
import TrackAdd from './TrackAdd';
import TrackList from './TrackList';
import TrackOptions from './TrackOptions';
import TrackRemove from './TrackRemove';

class OsuTrack extends SubCommandGroup {
  public constructor() {
    super();
    this.setName('track').setDescription('osu! tracking commands!');
    this.addSelfSubCommand(new SetChannel());
    this.addSelfSubCommand(new TrackAdd());
    this.addSelfSubCommand(new TrackRemove());
    this.addSelfSubCommand(new TrackOptions());
    this.addSelfSubCommand(new TrackList());
  }
}

export default OsuTrack;
