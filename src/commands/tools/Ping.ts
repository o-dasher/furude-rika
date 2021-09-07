import CommandABC from '@discord-classes/SlashCommands/CommandABC';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction } from 'discord.js';


class Ping extends CommandABC {
  constructor() {
    super();
    this.setName('ping').setDescription('Replies with pong!');
  }
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    await interaction.editReply(
      ` ** ${Localizer.getLocaleString(interaction, LocalizeTags.pingReply)
        .replace(
          'PINGMS',
          (Date.now() - interaction.createdTimestamp).toString()
        )
        .replace(
          'PINGAPIMS',
          Math.round(interaction.client.ws.ping).toString()
        )} ** `
    );
  }
}

export default {
  data: new Ping()
};
