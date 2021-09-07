import AmountOption from '@discord-classes/SlashCommands/SlashOptions/AmountOption';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import CommandABC from '@furude-commands/CommandABC';
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
  }
  async run(interaction: CommandInteraction) {
    if (
      !interaction.member ||
      !(interaction.member.permissions instanceof Permissions) ||
      !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
      !(interaction.channel instanceof TextChannel)
    ) {
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
