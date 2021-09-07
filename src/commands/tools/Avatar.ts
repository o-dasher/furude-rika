import BotEmbed from '@discord-classes/Embed/BotEmbed';
import InteractionHelper from '@discord-classes/Interactions/InteractionHelper';
import UserOption from '@discord-classes/SlashCommands/SlashOptions/UserOption';
import CommandABC from '@discord-classes/SlashCommands/CommandABC';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction } from 'discord.js';
import StringUtils from '@furude-utils/StringUtils';

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
        StringUtils.boldString(
          Localizer.getLocaleString(
            interaction,
            LocalizeTags.avatarDescription
          ).replace('USER', `[${user}](${user.avatarURL()})`)
        )
      );

    const avatar = user.avatarURL({ dynamic: true, size: 1024 });
    if (avatar) {
      embed.setImage(avatar);
    }

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default {
  data: new Avatar()
};
