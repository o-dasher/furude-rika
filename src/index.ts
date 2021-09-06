import FurudeRika from './Client/FurudeRika';
import CommandsReader from './IO/CommandsReader';
import Localizer from './Localization/Localizer';
import * as admin from 'firebase-admin';
import 'firebase/firestore';
import DBManager from './DB/DBManager';
import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      OSU_API_KEY: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
    }
  }
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});
Localizer.init();
DBManager.init();

const client = new FurudeRika();

const commands = CommandsReader.getAllCommands();

for (const command of commands) {
  client.commands.set(command.name, command);
}

client.start();
