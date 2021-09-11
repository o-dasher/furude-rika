import {
  CommandInteraction,
  MessageEmbed,
  MessageEmbedOptions
} from 'discord.js';

class BotEmbed extends MessageEmbed {
  public constructor(
    interaction?: CommandInteraction | null,
    data?: MessageEmbed | MessageEmbedOptions
  ) {
    super(data);
    if (interaction && interaction.guild && interaction.guild.me) {
      this.setColor(interaction.guild.me.displayColor);
    }
  }
}

export default BotEmbed;
