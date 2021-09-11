import Command from '@discord-classes/SlashCommands/Command';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction } from 'discord.js';

class Ping extends Command {
  constructor() {
    super();
    this.setName('ping').setDescription('Replies with pong!');
  }
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    await interaction.editReply(
      StringUtils.successString(
        Localizer.getLocaleString(interaction, LocalizeTags.pingReply)
          .replace(
            'PINGMS',
            (Date.now() - interaction.createdTimestamp).toString()
          )
          .replace(
            'PINGAPIMS',
            Math.round(interaction.client.ws.ping).toString()
          )
      )
    );
  }
}

export default {
  data: new Ping()
};
