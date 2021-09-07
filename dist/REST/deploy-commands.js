"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const Config_json_1 = require("@furude-json/Config.json");
const consola_1 = __importDefault(require("consola"));
const CommandsReader_1 = __importDefault(require("@furude-io/CommandsReader"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const commands = CommandsReader_1.default.getAllCommands().map((command) => command.toJSON());
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
(async () => {
    const req = { body: commands };
    try {
        await rest.put(Config_json_1.debug
            ? v9_1.Routes.applicationGuildCommands(Config_json_1.clientID, Config_json_1.devGuildID)
            : v9_1.Routes.applicationCommands(Config_json_1.clientID), req);
        consola_1.default.success('Successfully registered application commands.');
    }
    catch (error) {
        consola_1.default.error(error);
    }
})();
//# sourceMappingURL=deploy-commands.js.map