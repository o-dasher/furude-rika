import { CommandInteraction, MessageEmbed } from 'discord.js';
import i18next from 'i18next';
import BotEmbed from '../../DiscordClasses/Embed/BotEmbed';
import InteractionHelper from '../../DiscordClasses/Interactions/InteractionHelper';
import UserOption from '../../DiscordClasses/SlashCommands/SlashOptions/UserOption';
import CommandABC from '../CommandABC';
import Localizer from '../../Localization/Localizer';
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
    await interaction.deferReply();
    const user = InteractionHelper.defaultOptionalUser(interaction);
    
    const embed = new BotEmbed(interaction)
      .setTitle(
        Localizer.getLocaleString(interaction, LocalizeTags.avatarTitle)
      )
      .setDescription(
        ` ** 
        ${Localizer.getLocaleString(
          interaction,
          LocalizeTags.avatarDescription
        ).replace('USER', `[${user}](${user.avatarURL()})`)}
        ** `
      )
      .setImage(user.avatarURL({ dynamic: true, size: 1024 }));

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default {
  data: new Avatar()
};
