import BaseTrackEditor from '@furude-subs/Osu/Groups/Track/BaseTrackEditor';

class TrackRemove extends BaseTrackEditor {
  public constructor() {
    super(false);
    this.setName('remove').setDescription('Removes a user from being tracked.');
  }
}

export default TrackRemove;
