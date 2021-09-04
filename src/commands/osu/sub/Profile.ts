import { CommandInteraction } from 'discord.js';
import { re } from 'mathjs';
import BotEmbed from '../../../Classes/Embed/BotEmbed';
import OsuServerOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import Localizer from '../../../Localization/Localizer';
import LocalizeTags from '../../../Localization/LocalizeTags';
import SubCommandABC from '../../SubCommandABC';

class Profile extends SubCommandABC {
  constructor() {
    super();
    this.setName('profile').setDescription(
      "Views yours or someone's osu! profile"
    );
    this.addStringOption(new OsuUserOption());
    this.addStringOption(new OsuServerOption());
  }
  async run(interaction: CommandInteraction) {
    const server = OsuServerOption.getTag(interaction);
    const user = await OsuUserOption.getTag(interaction, server);

    if (user == null) {
      return;
    }

    const embed = new BotEmbed(interaction)
      .setDescription(
        `**[${Localizer.getLocaleString(
          interaction,
          LocalizeTags.osuProfileTitle
        ).replace('USER', user.name)}](https://osu.ppy.sh/users/${user.id})**`
      )
      .addField(
        'Perfomance',
        `**
        PP: ${user.pp.raw}
        Rank: #${user.pp.rank} (#${user.pp.countryRank})
        Accuracy: ${user.accuracyFormatted}
        PlayCount: ${user.counts.plays}
        Level: ${user.level.toFixed(2)}
        **`,
        true
      )
      .addField(
        'Counts',
        `**
          SSH: ${user.counts.SSH}
          SS: ${user.counts.SS}
          A: ${user.counts.A}
        **`,
        true
      )
      .setThumbnail(`http://s.ppy.sh/a/${user.id}`);

    await interaction.reply({
      embeds: [embed]
    });
  }
}

export default Profile;
