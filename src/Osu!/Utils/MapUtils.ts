import axios from 'axios';

abstract class MapUtils {
  private constructor() {}

  public static getBeatmapUrl(beatmapId: string | number): string {
    return `https://osu.ppy.sh/osu/${beatmapId}`;
  }

  public static async getBeatmapOsu(
    beatmapId: string | number
  ): Promise<string> {
    return (await axios.get(this.getBeatmapUrl(beatmapId))).data;
  }

  public static getThumbnailUrl(beatmapSetId: string | number): string {
    return `https://b.ppy.sh/thumb/${beatmapSetId}l.jpg`;
  }
}

export default MapUtils;
