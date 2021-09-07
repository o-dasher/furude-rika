import AmountOption from '@discord-classes/SlashCommands/SlashOptions/AmountOption';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import CommandABC from '@discord-classes/SlashCommands/CommandABC';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction, GuildChannel, Permissions } from 'discord.js';
import StringUtils from '@furude-utils/StringUtils';

class Clear extends CommandABC {
  constructor() {
    super();
    this.setName('clear').setDescription('Clear messages in a certain channel');
    this.addNumberOption(
      new AmountOption().setDescription('Amount of messages to be cleared.')
    );
    this.permissions.push(Permissions.FLAGS.MANAGE_MESSAGES);
  }
  async run(interaction: CommandInteraction) {
    const reply = await interaction.deferReply({ fetchReply: true });

    if (!(interaction.channel instanceof GuildChannel)) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.wrongChannelType)
        )
      );
      return;
    }

    if (!(await this.ensureUsage(interaction))) {
      return;
    }

    const amount = interaction.options.getNumber(OptionsTags.amount, true);
    await interaction.channel.bulkDelete(amount, true);

    await interaction.editReply({
      content: StringUtils.successString(
        Localizer.getLocaleString(interaction, LocalizeTags.clearReply).replace(
          'AMOUNT',
          amount.toString()
        )
      )
    });

    setTimeout(async () => {
      if (!interaction.channel) {
        return;
      }
      const message = await interaction.channel.messages.fetch(reply.id);
      if (message.deletable) {
        await message.delete();
      }
    }, 2500);
  }
}

export default {
  data: new Clear()
};
