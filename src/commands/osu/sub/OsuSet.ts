import BotEmbed from '@discord-classes/Embed/BotEmbed';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';
import OsuServerOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '@discord-classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import SubCommandABC from '@furude-commands/SubCommandABC';
import DBManager from '@furude-db/DBManager';
import DBPaths from '@furude-db/DBPaths';
import DBUserHelper from '@furude-db/DBUserHelper';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction } from 'discord.js';

class OsuSet extends SubCommandABC {
  private defaultServerOption = 'default-server';

  public constructor() {
    super();
    this.setName('set').setDescription(
      'Set your osu! related things with this command.'
    );
    this.addStringOption(
      new OsuUserOption().setDescription(
        'Your new user for the choosen server.'
      )
    );
    this.addStringOption(
      new OsuServerOption().setDescription(
        'The server to register your new user, defaults to your prefered server.'
      )
    );
    this.addStringOption(
      new OsuServerOption()
        .setName(this.defaultServerOption)
        .setDescription('Your prefered server, defaults to bancho.')
    );
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const userData = await DBManager.getUserData(interaction.user);
    let server = OsuServerOption.getTag(interaction, userData);

    if (interaction.options.getString(this.defaultServerOption)) {
      server = OsuServerOption.getTagFromString(
        interaction,
        this.defaultServerOption,
        userData
      );
      userData.osu.defaultServer = server.name;
    }

    if (interaction.options.getString(OptionsTags.osuUser)) {
      const user = await OsuUserOption.getTag(interaction, server, userData);
      DBUserHelper.changeUserName(user, userData, server);
    }

    await DBManager.furudeDB
      .collection(DBPaths.users)
      .doc(interaction.user.id)
      .set(userData, { merge: true });

    const embed = new BotEmbed(interaction)
      .setTitle(
        Localizer.getLocaleString(interaction, LocalizeTags.osuSetTitle)
      )
      .setDescription(
        `>>> **Default Server: ${userData.osu.defaultServer}\nBancho: ${userData.osu.bancho}\nDroid: ${userData.osu.droid}**`
      );

    await interaction.editReply({ embeds: [embed] });
  }
}

export default OsuSet;
