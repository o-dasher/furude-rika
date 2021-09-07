import 'module-alias/register';
import * as dotenv from 'dotenv';

dotenv.config();

import CommandsReader from '@furude-io/CommandsReader';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey
} from 'discord-interactions';
import getRawBody from 'raw-body';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Collection, CommandInteraction } from 'discord.js';
import ICommand from '@furude-commands/ICommand';

const commands = new Collection<string, ICommand>();
const allCommands = CommandsReader.getAllCommands();

for (const command of allCommands) {
  commands.set(command.name, command);
}

async function verifyRequest(req: VercelRequest): Promise<boolean> {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = await getRawBody(req);

  return verifyKey(
    rawBody,
    signature as string,
    timestamp as string,
    process.env.PUBLIC_KEY as string
  );
}

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  if (!(req.method == 'POST')) {
    return;
  }

  const isRequestValid = verifyRequest(req);

  if (!isRequestValid) {
    console.error('Invalid Request');
    return res.status(401).send({ error: 'Bad request signature ' });
  }

  const message = req.body;
  if (message.type == InteractionType.PING) {
    console.log('Handling Ping request');
    res.send({
      type: InteractionResponseType.PONG
    });
  } else if (message.type == InteractionType.APPLICATION_COMMAND) {
    const commandName = message.data.name;
    const command = commands.get(commandName);
    const interaction = message as CommandInteraction;
    command?.run(interaction);
  }
};
