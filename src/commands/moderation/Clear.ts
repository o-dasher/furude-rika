import { CommandInteraction, Permissions, TextChannel } from 'discord.js';
import i18next from 'i18next';
import OptionsTags from '../../Classes/SlashCommands/SlashOptions/OptionsTags';
import CommandABC from '../../interfaces/CommandABC';
import LocalizeTags from '../../Localization/LocalizeTags';

class Clear extends CommandABC {
  constructor() {
    super();
    this.setName('clear').setDescription('Clear messages in a certain channel');
  }
  async run(interaction: CommandInteraction) {
    if (
      !(interaction.member.permissions instanceof Permissions) ||
      !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
      !(interaction.channel instanceof TextChannel)
    ) {
      return;
    }

    const amount = interaction.options.getNumber(OptionsTags.amount, true);

    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply(
      `** ${i18next
        .t(LocalizeTags.clearReply)
        .replace('AMOUNT', amount.toString())} **
      `
    );
  }
}

export default {
  data: new Clear()
};
