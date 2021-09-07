"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const consola_1 = __importDefault(require("consola"));
const osu_droid_1 = require("osu-droid");
const ApiManager_1 = __importDefault(require("@furude-osu/API/ApiManager"));
const Droid_1 = __importDefault(require("@furude-osu/Servers/Droid"));
const OwnedAPIBeatmap_1 = __importDefault(require("@furude-osu/Users/beatmaps/OwnedAPIBeatmap"));
const ModUtils_1 = __importDefault(require("@furude-osu/Utils/ModUtils"));
const OsuGameCommand_1 = __importDefault(require("@furude-commands/Osu/Sub/Utils/OsuGameCommand"));
class OsuWithCalcCommand extends OsuGameCommand_1.default {
    async getScores(interaction, indexFrom, indexTo) {
        const params = await super.getOsuParams(interaction);
        const { osuUser, server } = params;
        let { error } = params;
        const osuParser = new osu_droid_1.Parser();
        const calculator = server instanceof Droid_1.default
            ? new osu_droid_1.DroidPerformanceCalculator()
            : new osu_droid_1.OsuPerformanceCalculator();
        let scores = [];
        if (osuUser) {
            try {
                scores = await osuUser.getScores();
            }
            catch (err) {
                error = true;
                consola_1.default.error(err);
            }
            const hasRecent = scores.length !== 0;
            if (!hasRecent) {
                await interaction.editReply(`**${osuUser.name} doesn't have any recent plays!**`);
                error = true;
            }
            if (!error) {
                indexFrom = Math.max(0, Math.min(indexFrom, scores.length - 1));
                indexTo = indexFrom + indexTo + 1;
                for (let i = 0; i < indexTo; i++) {
                    if (i < indexFrom) {
                        continue;
                    }
                    const score = scores[i];
                    try {
                        if (server instanceof Droid_1.default) {
                            let newBeatmap = new OwnedAPIBeatmap_1.default();
                            Object.assign(newBeatmap, (await ApiManager_1.default.banchoApi.getBeatmaps({
                                h: score.beatmap.hash
                            }))[0]);
                            score.beatmap = newBeatmap;
                        }
                    }
                    catch (err) {
                        consola_1.default.error(`Map: ${score.beatmap.hash}  not found!`);
                        score.beatmap.exists = false;
                    }
                    if (server instanceof Droid_1.default) {
                        const modString = [score.mods].join();
                        score.processedMods = ModUtils_1.default.pcStringToMods(modString);
                    }
                    else {
                        score.processedMods = ModUtils_1.default.pcModbitsToMods(parseInt(score.mods.toString()));
                    }
                    if (score.beatmap.exists) {
                        const mapDownloadUrl = `https://osu.ppy.sh/osu/${score.beatmap.id}`;
                        const osu = await axios_1.default.get(mapDownloadUrl);
                        const map = osuParser.parse(osu.data, score.processedMods).map;
                        const stars = calculator.stars.calculate({
                            map,
                            mods: score.processedMods
                        });
                        if (stars instanceof osu_droid_1.DroidStarRating &&
                            calculator instanceof osu_droid_1.DroidPerformanceCalculator) {
                            calculator.calculate({
                                stars,
                                combo: score.maxCombo,
                                accPercent: score.accuracy,
                                miss: score.counts.miss
                            });
                        }
                        else if (stars instanceof osu_droid_1.OsuStarRating &&
                            calculator instanceof osu_droid_1.OsuPerformanceCalculator) {
                            calculator.calculate({
                                stars,
                                combo: score.maxCombo,
                                accPercent: score.accuracy,
                                miss: score.counts.miss
                            });
                        }
                        score.calcs = Object.assign({}, calculator);
                    }
                    scores.push(score);
                }
            }
        }
        return {
            osuUser,
            server,
            scores,
            error,
            indexFrom,
            indexTo
        };
    }
}
exports.default = OsuWithCalcCommand;
//# sourceMappingURL=OsuWithCalcCommand.js.map