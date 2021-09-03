import {
  CommandInteraction,
  MessageEmbed,
  MessageEmbedOptions
} from 'discord.js';

class BotEmbed extends MessageEmbed {
  public constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
  }
  public init(interaction: CommandInteraction): void {
    this.setColor(interaction.guild.me.displayColor);
  }
}

export default BotEmbed;
