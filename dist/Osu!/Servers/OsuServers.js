"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bancho_1 = __importDefault(require("@furude-osu/Servers/Bancho"));
const Droid_1 = __importDefault(require("@furude-osu/Servers/Droid"));
class OsuServers {
    static bancho = new Bancho_1.default();
    static droid = new Droid_1.default();
    static servers = [this.bancho, this.droid];
    static getFromString(serverName) {
        let getServer = OsuServers.bancho;
        for (const osuServer of OsuServers.servers) {
            if (osuServer.name === serverName) {
                getServer = osuServer;
                break;
            }
        }
        return getServer;
    }
}
exports.default = OsuServers;
//# sourceMappingURL=OsuServers.js.map