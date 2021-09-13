import BaseTrackEditor from "./BaseTrackEditor";


class TrackAdd extends BaseTrackEditor {
  public constructor() {
    super(true);

    this.setName('add').setDescription('Adds a user to be tracked.');
  }
}

export default TrackAdd;
