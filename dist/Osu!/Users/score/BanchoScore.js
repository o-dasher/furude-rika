"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractScore_1 = __importDefault(require("@furude-osu/Users/score/AbstractScore"));
class BanchoScore extends AbstractScore_1.default {
    constructor(score) {
        super();
        Object.assign(this, score);
    }
}
exports.default = BanchoScore;
//# sourceMappingURL=BanchoScore.js.map