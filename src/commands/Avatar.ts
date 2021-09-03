import { CommandInteraction, MessageEmbed } from 'discord.js';
import i18next from 'i18next';
import BotEmbed from '../Classes/Embed/BotEmbed';
import CommandABC from '../interfaces/CommandABC';

class Avatar extends CommandABC {
  constructor() {
    super();
    this.setName('avatar');
    this.setDescription('Get yours or another user avatar.');
  }
  async run(interaction: CommandInteraction) {
    const embed = new BotEmbed();
    embed.init(interaction);
    embed.setTitle(i18next.t('avatarTitle'));
    embed.setDescription(
      `
      **
      ${i18next
        .t('avatarDescription')
        .replace(
          'USER',
          `[${interaction.user.username}](${interaction.user.avatarURL()})`
        )}
      **
      `
    );
    embed.setImage(interaction.user.avatarURL({ dynamic: true, size: 1024 }));
    interaction.reply({
      embeds: [embed]
    });
  }
}

export default {
  data: new Avatar()
};
