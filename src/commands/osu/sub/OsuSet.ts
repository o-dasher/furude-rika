import { CommandInteraction } from 'discord.js';
import BotEmbed from '../../../Classes/Embed/BotEmbed';
import OptionsTags from '../../../Classes/SlashCommands/SlashOptions/OptionsTags';
import OsuServerOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import DBManager from '../../../DB/DBManager';
import DBPaths from '../../../DB/DBPaths';
import Localizer from '../../../Localization/Localizer';
import LocalizeTags from '../../../Localization/LocalizeTags';
import SubCommandABC from '../../SubCommandABC';

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

    const userData = await DBManager.getUserData(interaction);
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
      if (user != null) {
        userData.osu[`${server.name}`] = user.id;
      }
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
        `>>> **
        Default Server: ${userData.osu.defaultServer}
        Bancho: ${userData.osu.bancho}
        Droid: ${userData.osu.droid}

        **`
      );

    await interaction.editReply({ embeds: [embed] });
  }
}

export default OsuSet;
