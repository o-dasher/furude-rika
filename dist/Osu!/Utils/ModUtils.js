"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const osu_droid_1 = require("osu-droid");
class ModUtils extends osu_droid_1.ModUtil {
    constructor() {
        super();
    }
    static getStringRepr(mods) {
        let str = '';
        for (const mod of mods) {
            str = str.concat(mod.acronym);
        }
        return str;
    }
}
exports.default = ModUtils;
//# sourceMappingURL=ModUtils.js.map