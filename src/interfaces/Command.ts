import {CommandInteraction, Interaction} from 'discord.js';

interface Command {
  run(interaction: CommandInteraction): void;
}

export default Command;
