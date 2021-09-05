import {
  CommandInteraction,
  MessageEmbed,
  MessageEmbedOptions
} from 'discord.js';

class BotEmbed extends MessageEmbed {
  public constructor(
    interaction: CommandInteraction,
    data?: MessageEmbed | MessageEmbedOptions
  ) {
    super(data);
    if (interaction.guild && interaction.guild.me) {
      this.setColor(interaction.guild.me.displayColor);
    }
  }
}

export default BotEmbed;
