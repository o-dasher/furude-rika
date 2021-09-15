import FurudeDB from '@furude-db/FurudeDB';
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
import DBPaths from '@furude-db/DBPaths';
import DBDroidUser from '@furude-db/DBDroidUser';
import OptionsTags from '@discord-classes/SlashCommands/SlashOptions/OptionsTags';

const cooldown: string[] = [];

class DroidSubmit extends OsuGameCommand {
  public constructor() {
    super({ server: false });
    this.setName('submit').setDescription(
      'Submits all your pp data! 1 day cooldown'
    );
  }
  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    let discordID = interaction.user.id;
    const optionalUser = UserOption.getTag(interaction);
    const osuTag = interaction.options.getString(OptionsTags.osuUser);

    if (optionalUser || osuTag) {
      if (interaction.user.id === ownerID) {
        discordID = optionalUser?.id ?? discordID;
      } else {
        await interaction.editReply(
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

    const { userData, osuUser, error } = await this.getOsuParams(interaction, {
      server: OsuServers.droid,
      needsExtraInfo: false
    });

    if (error) {
      return;
    }

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

    const user = await ApiManager.droidPPBoardAPI.getPlayerTop(osuUser!.id!);
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
    const dbUser: DBDroidUser = new DBDroidUser();

    // SKILLS
    const aims: number[] = [];
    const speeds: number[] = [];
    const extras: number[] = [];

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
      calculator.calculate({
        stars: calculator.stars.calculate({ map, mods }),
        accPercent: play.accuracy,
        combo: play.combo,
        miss: play.miss
      });
      play.pp = calculator.total;
      aims.push(calculator.aim);
      speeds.push(calculator.speed);
      extras.push(calculator.total);
    }

    dbUser.skills.speed = PPHelper.weightList(speeds);
    dbUser.skills.aim = PPHelper.weightList(aims);
    dbUser.skills.extra =
      PPHelper.weightList(extras) - (dbUser.skills.speed + dbUser.skills.aim);

    user.pp.total = PPHelper.calculateFinalPerformancePoints(plays);
    user.pp.list = user.pp.list.sort((a, b) => b.pp - a.pp);
    dbUser.dpp = user.pp;
    dbUser.username = osuUser?.name?.toLowerCase() ?? '';

    await FurudeDB.db()
      .collection(DBPaths.droid_users)
      .doc(user.uid.toString())
      .set(JSON.parse(JSON.stringify(dbUser)), { merge: true });

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
