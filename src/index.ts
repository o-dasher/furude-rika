import 'module-alias/register';

import FurudeRika from '@furude-client/FurudeRika';
import CommandsReader from '@furude-io/CommandsReader';
import Localizer from '@furude-localization/Localizer';
import * as admin from 'firebase-admin';
import 'firebase-admin/lib/firestore';
import DBManager from '@furude-db/DBManager';
import * as dotenv from 'dotenv';
import { readdirSync } from 'fs';
import consolaGlobalInstance from 'consola';

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

consolaGlobalInstance.log(readdirSync('./src'));

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
