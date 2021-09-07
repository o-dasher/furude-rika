"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractUser {
    defaultString = '';
    defaultNumber = -1;
    id = this.defaultNumber;
    name = this.defaultString;
    counts = {
        '300': this.defaultNumber,
        '100': this.defaultNumber,
        '50': this.defaultNumber,
        SSH: this.defaultNumber,
        SS: this.defaultNumber,
        SH: this.defaultNumber,
        S: this.defaultNumber,
        A: this.defaultNumber,
        plays: this.defaultNumber
    };
    scores = {
        ranked: this.defaultNumber,
        total: this.defaultNumber
    };
    pp = {
        raw: this.defaultNumber,
        rank: this.defaultNumber,
        countryRank: this.defaultNumber
    };
    country = this.defaultString;
    level = this.defaultNumber;
    accuracy = this.defaultNumber;
    secondsPlayed = this.defaultNumber;
    raw_joinDate = this.defaultString;
    events;
    joinDate = this.defaultString;
    accuracyFormatted = this.defaultString;
    profileUrl = this.defaultString;
    avatarUrl = this.defaultString;
}
exports.default = AbstractUser;
//# sourceMappingURL=AbstractUser.js.map