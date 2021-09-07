"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OwnedAPIBeatmap_1 = __importDefault(require("@furude-osu/Users/beatmaps/OwnedAPIBeatmap"));
class AbstractScore {
    defaultString = 'NULL';
    score = -1;
    user = {
        name: this.defaultString,
        id: this.defaultString
    };
    beatmapId = '';
    counts = {
        '300': -1,
        '100': -1,
        '50': -1,
        geki: -1,
        katu: -1,
        miss: -1
    };
    maxCombo = -1;
    perfect = false;
    raw_date = this.defaultString;
    rank = this.defaultString;
    pp = -1;
    hasReplay = false;
    raw_mods = -1;
    beatmap = new OwnedAPIBeatmap_1.default();
    date = this.defaultString;
    mods = this.defaultString;
    accuracy = -1;
    processedMods = [];
    calcs = null;
}
exports.default = AbstractScore;
//# sourceMappingURL=AbstractScore.js.map