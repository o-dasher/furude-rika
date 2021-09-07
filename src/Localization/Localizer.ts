import { CommandInteraction } from 'discord.js';
import i18next from 'i18next';
import { resources } from '@furude-localization/Strings.json';

abstract class Localizer {
  public static defaultLocale = 'en';

  private constructor() {}

  public static init(): void {
    i18next.init({
      lng: this.defaultLocale,
      debug: false,
      resources
    });
  }

  public static getLocaleString(
    interaction: CommandInteraction,
    tag: string
  ): string {
    return i18next.t(tag, { lng: this.getlanguage(interaction) });
  }

  private static getlanguage(interaction: CommandInteraction): string {
    let language = i18next.language;
    if (!interaction.guild) {
      return language;
    }
    switch (interaction.guild.preferredLocale) {
      case 'pt-BR':
        language = 'pt';
        break;
      case 'pt':
        language = 'pt';
        break;
      default:
        language = i18next.language;
        break;
    }
    return language;
  }

  public static localizeNumber(
    interaction: CommandInteraction,
    number: number
  ): string {
    return number.toLocaleString(
      interaction.guild ? interaction.guild.preferredLocale : this.defaultLocale
    );
  }
}

export default Localizer;
