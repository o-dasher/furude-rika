"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_osu_1 = __importDefault(require("node-osu"));
const DroidScrapeApi_1 = __importDefault(require("@furude-osu/API/DroidScrapeApi"));
const { OSU_API_KEY } = process.env;
class ApiManager {
    constructor() { }
    static banchoApi = new node_osu_1.default.Api(OSU_API_KEY, {
        completeScores: true,
        parseNumeric: true
    });
    static droidApi = new DroidScrapeApi_1.default();
}
exports.default = ApiManager;
//# sourceMappingURL=ApiManager.js.map