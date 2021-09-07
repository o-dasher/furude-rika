"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OwnedAPIBeatmap {
    exists = true;
    id = '';
    beatmapSetId = '';
    hash = '';
    title = '';
    creator = '';
    version = '';
    source = '';
    artist = '';
    genre = {
        '0': '',
        '1': '',
        '10': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': '',
        '7': '',
        '9': ''
    };
    language = {
        '0': '',
        '1': '',
        '10': '',
        '11': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': '',
        '7': '',
        '8': '',
        '9': ''
    };
    rating = 0;
    bpm = 0;
    mode = {
        '0': '',
        '1': '',
        '2': '',
        '3': ''
    };
    tags = [];
    approvalStatus = {
        '-1': '',
        '-2': '',
        '0': '',
        '1': '',
        '2': '',
        '3': '',
        '4': ''
    };
    raw_submitDate = '';
    raw_approvedDate = '';
    raw_lastUpdate = '';
    maxCombo = 0;
    objects = {
        normal: 0,
        slider: 0,
        spinner: 0
    };
    difficulty = {
        rating: 0,
        aim: 0,
        speed: 0,
        size: 0,
        overall: 0,
        approach: 0,
        drain: 0
    };
    length = {
        total: 0,
        drain: 0
    };
    counts = {
        favorites: 0,
        favourites: 0,
        plays: 0,
        passes: 0
    };
    hasDownload = false;
    hasAudio = false;
}
exports.default = OwnedAPIBeatmap;
//# sourceMappingURL=OwnedAPIBeatmap.js.map