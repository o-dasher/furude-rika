
import axios from 'axios';
import { Beatmap } from 'node-osu';

abstract class MapUtils {
  private constructor() {}

  public static getBeatmapPageUrl(beatmap: Beatmap) {
    return `https://osu.ppy.sh/beatmapsets/${beatmap.beatmapSetId}#osu/${beatmap.id}`;
  }

  public static getBeatmapOsuUrl(beatmapId: string | number): string {
    return `https://osu.ppy.sh/osu/${beatmapId}`;
  }

  public static async getBeatmapOsu(
    beatmapId: string | number
  ): Promise<string> {
    return (await axios.get(this.getBeatmapOsuUrl(beatmapId))).data;
  }

  public static getThumbnailUrl(beatmapSetId: string | number): string {
    return `https://b.ppy.sh/thumb/${beatmapSetId}l.jpg`;
  }
}

export default MapUtils;
