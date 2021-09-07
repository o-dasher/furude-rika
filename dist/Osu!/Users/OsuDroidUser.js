"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiManager_1 = __importDefault(require("@furude-osu/API/ApiManager"));
const AbstractUser_1 = __importDefault(require("@furude-osu/Users/AbstractUser"));
class OsuDroidUser extends AbstractUser_1.default {
    droidScores = [];
    async buildUser(username) {
        Object.assign(this, await ApiManager_1.default.droidApi.getUser(username.toString()));
        return this;
    }
    async getScores() {
        return this.droidScores;
    }
}
exports.default = OsuDroidUser;
//# sourceMappingURL=OsuDroidUser.js.map