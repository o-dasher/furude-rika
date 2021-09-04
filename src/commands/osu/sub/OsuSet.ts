import { CommandInteraction } from 'discord.js';
import BotEmbed from '../../../Classes/Embed/BotEmbed';
import OptionsTags from '../../../Classes/SlashCommands/SlashOptions/OptionsTags';
import OsuServerOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import DBManager from '../../../DB/DBManager';
import DBPaths from '../../../DB/DBPaths';
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
    const userData = await DBManager.getUserData(interaction);
    const server = OsuServerOption.getTag(interaction, userData);

    if (interaction.options.getString(this.defaultServerOption)) {
      userData.osu.defaultServer = OsuServerOption.getTagFromString(
        interaction,
        this.defaultServerOption,
        userData
      ).name;
    }

    if (interaction.options.getString(OptionsTags.osuUser)) {
      userData.osu[`${server.name}`] = (
        await OsuUserOption.getTag(interaction, server, userData)
      ).id;
    }

    await DBManager.furudeDB
      .collection(DBPaths.users)
      .doc(interaction.user.id)
      .set(userData, { merge: true });

    const embed = new BotEmbed(interaction)
      .setTitle('Your updated DB data')
      .setDescription(
        `>>> **
        Default Server: ${userData.osu.defaultServer}
        Bancho: ${userData.osu.bancho}
        Droid: ${userData.osu.droid}

        **`
      );

    await interaction.reply({ embeds: [embed] });
  }
}

export default OsuSet;
