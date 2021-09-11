import DBManager from '@furude-db/DBManager';
import ApiManager from '@furude-osu/API/ApiManager';
import { CommandInteraction } from 'discord.js';
import { ownerID } from '@furude-json/Config.json';
import { DroidPerformanceCalculator, Parser } from 'osu-droid';
import { Beatmap } from 'node-osu';
import MapUtils from '@furude-osu/Utils/MapUtils';
import ModUtils from '@furude-osu/Utils/ModUtils';
import PPHelper from '@furude-utils/pp/PPHelper';
import StringUtils from '@furude-utils/StringUtils';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import OsuServers from '@furude-osu/Servers/OsuServers';
import OsuGameCommand from '@furude-subs/Osu/Utils/OsuGameCommand';
import UserOption from '@discord-classes/SlashCommands/SlashOptions/UserOption';

const cooldown: string[] = [];

class DroidSubmit extends OsuGameCommand {
  public constructor() {
    super({ server: false, osuUser: false });
    this.setName('submit').setDescription(
      'Submits all your pp data! 1 day cooldown'
    );
    2;
  }
  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    let discordID = interaction.user.id;
    const optionalUser = UserOption.getTag(interaction);

    if (optionalUser) {
      if (interaction.user.id === ownerID) {
        discordID = optionalUser.id;
      } else {
        await interaction.reply(
          StringUtils.errorString(
            Localizer.getLocaleString(
              interaction,
              LocalizeTags.missingPermissions
            )
          )
        );
        return;
      }
    }

    if (cooldown.includes(discordID) && !(interaction.user.id === ownerID)) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.onCooldown)
        )
      );
      return;
    } else {
      cooldown.push(discordID);
      setTimeout(() => {
        cooldown.splice(
          cooldown.findIndex((id) => id === discordID),
          1
        );
      }, 1000 * 60 * 60 * 24);
    }

    const { userData } = await this.getOsuParams(interaction, {
      server: OsuServers.droid
    });

    if (!userData.osu || !userData.osu.droid) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(
            interaction,
            LocalizeTags.osuSetRequired
          ).replace('SERVER', OsuServers.droid.name)
        )
      );
      return;
    }

    const user = await ApiManager.droidPPBoardAPI.getPlayerTop(
      userData.osu.droid
    );

    if (!user.pp) {
      await interaction.editReply(
        StringUtils.errorString("You don't have an account binded to alice!")
      );
      return;
    }

    const plays = user.pp.list;
    await interaction.editReply(
      StringUtils.successString(
        `Trying to calculate ${user.username} top plays it may take a while...`
      )
    );

    for await (const play of plays) {
      
      const parser = new Parser();
      const calculator = new DroidPerformanceCalculator();

      let apiMap: Beatmap;
      try {
        apiMap = (await ApiManager.banchoApi.getBeatmaps({ h: play.hash }))[0];
      } catch (err) {
        continue;
      }
      const mods = ModUtils.pcStringToMods(play.mods);
      const osu = await MapUtils.getBeatmapOsu(apiMap.id);
      const map = parser.parse(osu, mods).map;
      play.pp = calculator.calculate({
        stars: calculator.stars.calculate({ map, mods }),
        accPercent: play.accuracy,
        combo: play.combo,
        miss: play.miss
      }).total;
    }

    user.pp.total = PPHelper.calculateFinalPerformancePoints(plays);
    user.pp.list = user.pp.list.sort((a, b) => b.pp - a.pp);

    await DBManager.getUserDoc(discordID).set(
      {
        osu: {
          dpp: user.pp
        }
      },
      { merge: true }
    );

    await interaction.followUp(
      StringUtils.successString(
        `OK! Submitted all ${
          user.username
        } top plays, you ended up with ${user.pp.total.toFixed(2)}pp`
      )
    );
  }
}

export default DroidSubmit;
