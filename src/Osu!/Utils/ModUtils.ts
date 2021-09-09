import { Mod, ModUtil } from 'osu-droid';

abstract class ModUtils extends ModUtil {
  private constructor() {
    super();
  }

  public static getStringRepr(mods: Mod[]): string {
    let str = '';
    for (const mod of mods) {
      str = str.concat(mod.acronym);
    }
    return str.length == 0 ? '' : `+${str}`;
  }
}

export default ModUtils;
