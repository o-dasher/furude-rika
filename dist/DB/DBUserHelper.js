"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OsuServers_1 = __importDefault(require("@furude-osu/Servers/OsuServers"));
class DBUserHelper {
    constructor() { }
    static getUserName(userData, server) {
        let usernameOrID = userData.osu.bancho.toString();
        switch (server) {
            case OsuServers_1.default.droid:
                usernameOrID = userData.osu.droid.toString();
                break;
        }
        return usernameOrID;
    }
    static changeUserName(osuUser, userData, server) {
        if (osuUser != null) {
            switch (server) {
                case OsuServers_1.default.droid:
                    userData.osu.droid = osuUser.id;
                    break;
                default:
                    userData.osu.bancho = osuUser.id;
                    break;
            }
        }
    }
}
exports.default = DBUserHelper;
//# sourceMappingURL=DBUserHelper.js.map