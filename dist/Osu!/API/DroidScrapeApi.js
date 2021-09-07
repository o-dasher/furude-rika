"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OsuDroidUser_1 = __importDefault(require("@furude-osu/Users/OsuDroidUser"));
const ParamString_1 = __importDefault(require("@furude-osu/API/ParamString"));
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const OsuDroidScore_1 = __importDefault(require("@furude-osu/Users/score/OsuDroidScore"));
const OwnedAPIBeatmap_1 = __importDefault(require("@furude-osu/Users/beatmaps/OwnedAPIBeatmap"));
class DroidScrapeApi {
    baseUrl = 'http://ops.dgsrz.com/';
    profileEndPoint = new ParamString_1.default(this.baseUrl.concat('profile.php'));
    async getUser(username) {
        let user = new OsuDroidUser_1.default();
        let finalEndpoint = new ParamString_1.default(this.profileEndPoint.toString());
        finalEndpoint.addParam('uid', username);
        const res = await axios_1.default.get(finalEndpoint.toString());
        const $ = cheerio_1.default.load(res.data);
        user.name = $('div.h3.m-t-xs.m-b-xs').text();
        user.country = $('small.text-muted').first().text();
        user.counts = {
            '300': 0,
            '100': 0,
            '50': 0,
            SSH: 0,
            SS: 0,
            SH: 0,
            S: 0,
            A: 0,
            plays: 0
        };
        user.level = 0;
        user.pp = { raw: 0, rank: 0, countryRank: 0 };
        user.scores = { ranked: 0, total: 0 };
        user.pp.rank = parseInt($('span.m-b-xs.h4.block').first().text());
        user.pp.countryRank = user.pp.rank;
        user.id = parseInt(username);
        user.profileUrl = `http://ops.dgsrz.com/profile.php?uid=${user.id}`;
        const images = $('img');
        for (let i = 0; i < images.length; i++) {
            const el = images[i];
            if (i == 3 && el.attribs.src != undefined) {
                user.avatarUrl = el.attribs.src;
                break;
            }
        }
        const pullRight = $('span.pull-right');
        for (let i = 0; i < pullRight.length; i++) {
            if (i <= 2) {
                continue;
            }
            const el = $.load(pullRight[i]);
            const textSafe = el.text().replaceAll(',', '');
            const val = parseFloat(textSafe);
            switch (i) {
                case 3:
                    user.scores.total = val;
                    user.scores.ranked = val;
                    break;
                case 4:
                    user.accuracy = val;
                    user.accuracyFormatted = `${val.toFixed(2)}%`;
                    break;
                case 5:
                    user.counts.plays = val;
                    break;
            }
        }
        const liListGroupItem = $('li.list-group-item');
        for (let i = 0; i < liListGroupItem.length; i++) {
            if (i > liListGroupItem.length - 9) {
                break;
            }
            const score = new OsuDroidScore_1.default();
            score.beatmap = new OwnedAPIBeatmap_1.default();
            const el = $.load(liListGroupItem[i]);
            let idk = el.text().replaceAll('\n', '').replaceAll('  ', '').split(']');
            const headData = idk[0].split('[');
            score.beatmap.title = headData[0].slice(0, -1);
            score.beatmap.version = headData[1];
            idk = idk.slice(1).join('').split('%');
            const stats = idk[0].split('/');
            for (const stat of stats) {
                if (score.raw_date === score.defaultString &&
                    score.date === score.defaultString) {
                    const date = stat.slice(0, -1);
                    score.date = date;
                    score.raw_date = date;
                }
                else if (score.score === -1) {
                    score.score = parseInt(stat.replaceAll(',', ''));
                }
                else if (score.mods === score.defaultString) {
                    score.mods = stat;
                    score.mods = score.mods
                        .replaceAll('DoubleTime', 'DT')
                        .replaceAll('HardRock', 'HR')
                        .replaceAll('Precise', 'PR')
                        .replaceAll('NightCore', 'NC')
                        .replaceAll('Hidden', 'HD')
                        .replaceAll('NoFail', 'NF')
                        .replaceAll('HalfTime', 'HT')
                        .replaceAll('Easy', 'EZ')
                        .replaceAll(',', '')
                        .replaceAll(' ', '');
                }
                else if (score.maxCombo === -1) {
                    score.maxCombo = parseInt(stat.replace('x', ''));
                }
                else if (score.accuracy === -1) {
                    score.accuracy = parseFloat(stat);
                }
            }
            if (score.mods == '') {
                score.mods = 'NM';
            }
            score.mods += 'TD';
            idk = idk.slice(1);
            const hiddenSep = idk.join().split(':');
            score.counts = {
                '300': 0,
                '100': 0,
                '50': 0,
                geki: 0,
                katu: 0,
                miss: 0
            };
            score.counts.miss = parseInt(hiddenSep[1].split(',')[0]);
            score.beatmap.hash = hiddenSep[2].replace('}', '').replaceAll(' ', '');
            score.user = {
                name: user.name,
                id: user.id.toString()
            };
            user.droidScores.push(score);
        }
        return user;
    }
}
exports.default = DroidScrapeApi;
//# sourceMappingURL=DroidScrapeApi.js.map