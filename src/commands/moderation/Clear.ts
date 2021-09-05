import { CommandInteraction, Permissions, TextChannel } from 'discord.js';
import OptionsTags from '../../DiscordClasses/SlashCommands/SlashOptions/OptionsTags';
import CommandABC from '../CommandABC';
import Localizer from '../../Localization/Localizer';
import LocalizeTags from '../../Localization/LocalizeTags';
import AmountOption from '../../DiscordClasses/SlashCommands/SlashOptions/AmountOption';

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
