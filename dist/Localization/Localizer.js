"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const Strings_json_1 = require("@furude-localization/Strings.json");
class Localizer {
    static init() {
        i18next_1.default.init({
            lng: 'en',
            debug: false,
            resources: Strings_json_1.resources
        });
    }
    static getLocaleString(interaction, tag) {
        return i18next_1.default.t(tag, { lng: this.getlanguage(interaction) });
    }
    static getlanguage(interaction) {
        let language = i18next_1.default.language;
        if (!interaction.guild) {
            return language;
        }
        switch (interaction.guild.preferredLocale) {
            case 'pt-BR':
                language = 'pt';
                break;
            case 'pt':
                language = 'pt';
                break;
            default:
                language = i18next_1.default.language;
                break;
        }
        return language;
    }
}
exports.default = Localizer;
//# sourceMappingURL=Localizer.js.map