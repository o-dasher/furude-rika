import { CommandInteraction, MessageEmbed } from 'discord.js';
import i18next from 'i18next';
import BotEmbed from '../../Classes/Embed/BotEmbed';
import InteractionHelper from '../../Classes/Interactions/InteractionHelper';
import UserOption from '../../Classes/SlashCommands/SlashOptions/UserOption';
import CommandABC from '../../interfaces/CommandABC';
import LocalizeTags from '../../Localization/LocalizeTags';

class Avatar extends CommandABC {
  constructor() {
    super();
    this.setName('avatar').setDescription('Get yours or another user avatar.');
    this.addUserOption(
      new UserOption().setDescription(
        'The user which you want to get the avatar from.'
      )
    );
  }
  async run(interaction: CommandInteraction) {
    const user = InteractionHelper.defaultOptionalUser(interaction);
    const embed = new BotEmbed(interaction)
      .setTitle(this.getLocaleString(interaction, LocalizeTags.avatarTitle))
      .setDescription(
        ` ** 
        ${super
          .getLocaleString(interaction, LocalizeTags.avatarDescription)
          .replace('USER', `[${user}](${user.avatarURL()})`)}
        ** `
      )
      .setImage(user.avatarURL({ dynamic: true, size: 1024 }));
    await interaction.reply({
      embeds: [embed]
    });
  }
}

export default {
  data: new Avatar()
};
