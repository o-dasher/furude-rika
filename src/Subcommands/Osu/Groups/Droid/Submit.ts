import SubCommand from '@discord-classes/SlashCommands/SubCommand';
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

const cooldown: string[] = [];

class Submit extends SubCommand {
  public constructor() {
    super();
    this.setName('submit').setDescription(
      'Submits all your pp data! 1 day cooldown'
    );
  }
  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    if (
      cooldown.includes(interaction.user.id) &&
      !(interaction.user.id == ownerID)
    ) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.onCooldown)
        )
      );
      return;
    } else {
      cooldown.push(interaction.user.id);
      setTimeout(() => {
        cooldown.splice(
          cooldown.findIndex((id) => id === interaction.user.id),
          1
        );
      }, 1000 * 60 * 60 * 24);
    }

    const userData = await DBManager.getUserData(interaction.user);

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
        'Trying to calculate your top plays it may take a while...'
      )
    );

    for (let i = 0; i < plays.length; i++) {
      const play = plays[i];

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

    await DBManager.getUserDoc(interaction.user.id).set(
      {
        osu: {
          dpp: user.pp
        }
      },
      { merge: true }
    );

    await interaction.followUp(
      StringUtils.successString(
        `OK! Submitted all your top plays, you ended up with ${user.pp.total.toFixed(
          2
        )}pp`
      )
    );
  }
}

export default Submit;
