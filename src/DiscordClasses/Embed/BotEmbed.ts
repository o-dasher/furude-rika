import {
  ColorResolvable,
  CommandInteraction,
  MessageEmbed,
  MessageEmbedOptions
} from 'discord.js';

class BotEmbed extends MessageEmbed {
  private defaultColor: ColorResolvable = 'PURPLE';

  public constructor(
    interaction?: CommandInteraction | null,
    data?: MessageEmbed | MessageEmbedOptions,
  ) {
    super(data);
    this.setColor(
      data?.color??
        interaction?.guild?.me?.displayColor ??
        this.defaultColor
    );
  }
}

export default BotEmbed;
