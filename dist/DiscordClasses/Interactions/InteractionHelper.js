"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OptionsTags_1 = __importDefault(require("@discord-classes/SlashCommands/SlashOptions/OptionsTags"));
class InteractionHelper {
    constructor() { }
    static defaultOptionalUser(interaction) {
        return interaction.options.getUser(OptionsTags_1.default.user) ?? interaction.user;
    }
    static defaultOptionalNumber(number, defaultNumber) {
        return number ?? defaultNumber;
    }
}
exports.default = InteractionHelper;
//# sourceMappingURL=InteractionHelper.js.map