import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import i18next from 'i18next';

import Command from './Command';

abstract class CommandABC extends SlashCommandBuilder implements Command {
  abstract run(interaction: CommandInteraction): void;

  protected getLocaleString(
    interaction: CommandInteraction,
    tag: string
  ): string {
    return i18next.t(tag, { lng: this.getlanguage(interaction) });
  }

  private getlanguage(interaction: CommandInteraction): string {
    let language = i18next.language;
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
}

export default CommandABC;
