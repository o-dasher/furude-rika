import AmountOption from '@discord-classes/SlashCommands/SlashOptions/AmountOption';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import CommandABC from '@discord-classes/SlashCommands/CommandABC';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction, Permissions, TextChannel } from 'discord.js';

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
    await interaction.deferReply();

    if (!(interaction.channel instanceof TextChannel)) {
      await interaction.editReply(
        Localizer.getLocaleString(interaction, LocalizeTags.wrongChannelType)
      );
      return;
    }

    if (!this.ensurePermissions) {
      return;
    }

    const amount = interaction.options.getNumber(OptionsTags.amount, true);
    await interaction.channel.bulkDelete(amount, true);

    const reply = await interaction.reply({
      content: `** ${Localizer.getLocaleString(
        interaction,
        LocalizeTags.clearReply
      ).replace('AMOUNT', amount.toString())} **`,
      fetchReply: true
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
