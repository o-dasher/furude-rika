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
require("module-alias/register");
const FurudeRika_1 = __importDefault(require("@furude-client/FurudeRika"));
const CommandsReader_1 = __importDefault(require("@furude-io/CommandsReader"));
const Localizer_1 = __importDefault(require("@furude-localization/Localizer"));
const admin = __importStar(require("firebase-admin"));
require("firebase/firestore");
const DBManager_1 = __importDefault(require("@furude-db/DBManager"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});
Localizer_1.default.init();
DBManager_1.default.init();
const client = new FurudeRika_1.default();
const commands = CommandsReader_1.default.getAllCommands();
for (const command of commands) {
    client.commands.set(command.name, command);
}
client.start();
//# sourceMappingURL=index.js.map