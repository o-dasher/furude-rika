"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = require("firebase-admin");
const OsuServers_1 = __importDefault(require("@furude-osu/Servers/OsuServers"));
const DBPaths_1 = __importDefault(require("@furude-db/DBPaths"));
class DBManager {
    constructor() { }
    static furudeDB;
    static init() {
        this.furudeDB = (0, firebase_admin_1.firestore)();
    }
    static async getUserData(discordUser) {
        const user = {
            osu: {
                defaultServer: OsuServers_1.default.bancho.name,
                bancho: -1,
                droid: -1
            }
        };
        const currentData = (await DBManager.furudeDB
            .collection(DBPaths_1.default.users)
            .doc(discordUser.id)
            .get()).data();
        Object.assign(user, currentData);
        return user;
    }
}
exports.default = DBManager;
//# sourceMappingURL=DBManager.js.map