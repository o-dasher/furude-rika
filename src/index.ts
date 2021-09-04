import FurudeConfig from './Client/FurudeConfig';
import FurudeRika from './Client/FurudeRika';
import * as configParams from './json/config.json';
import CommandsReader from './IO/CommandsReader';
import Localizer from './Localization/Localizer';
import * as admin from 'firebase-admin';
import 'firebase/firestore';
import * as firebaseConfig from './json/FirebaseConfig.json';
import DBManager from './DB/DBManager';

admin.initializeApp({ credential: admin.credential.cert(firebaseConfig) });

Localizer.init();
DBManager.init();

const config = new FurudeConfig(configParams);
const client = new FurudeRika(config);

const commands = CommandsReader.getAllCommands();

for (const command of commands) {
  client.commands.set(command.name, command);
}

client.start();
