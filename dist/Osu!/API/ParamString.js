"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParamString {
    string;
    constructor(string_) {
        this.string = string_;
        if (this.string.slice(-1) !== '?') {
            this.string = this.string.concat('?');
        }
    }
    addParam(param, value) {
        this.string = this.string.concat(`${param}=${value}&`);
    }
    toString() {
        return this.string;
    }
}
exports.default = ParamString;
//# sourceMappingURL=ParamString.js.map