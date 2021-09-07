"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiManager_1 = __importDefault(require("@furude-osu/API/ApiManager"));
const AbstractUser_1 = __importDefault(require("@furude-osu/Users/AbstractUser"));
const BanchoScore_1 = __importDefault(require("@furude-osu/Users/score/BanchoScore"));
class BanchoUser extends AbstractUser_1.default {
    async buildUser(username) {
        const u = username.toString();
        Object.assign(this, await ApiManager_1.default.banchoApi.getUser({ u }));
        this.accuracyFormatted = `${this.accuracy.toFixed(2)}%`;
        this.profileUrl = `https://osu.ppy.sh/users/${this.id}`;
        this.avatarUrl = `http://s.ppy.sh/a/${this.id}`;
        return this;
    }
    async getScores() {
        const scores = await ApiManager_1.default.banchoApi.getScores({ u: this.name });
        const banchoScores = [];
        for (const score of scores) {
            banchoScores.push(new BanchoScore_1.default(score));
        }
        return banchoScores;
    }
}
exports.default = BanchoUser;
//# sourceMappingURL=BanchoUser.js.map