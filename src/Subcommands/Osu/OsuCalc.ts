import SubCommandABC from '@discord-classes/SlashCommands/SubCommandABC';
import {
  SlashCommandBooleanOption,
  SlashCommandStringOption
} from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import MapUtils from '@furude-osu/Utils/MapUtils';
import {
  Accuracy,
  Beatmap,
  DroidPerformanceCalculator,
  OsuPerformanceCalculator,
  Parser,
  PerformanceCalculator
} from 'osu-droid';
import { BeatmapDifficultyHelper } from '@furude-utils/Helpers/BeatmapDifficultyHelper';
import BotEmbed from '@discord-classes/Embed/BotEmbed';
import StringUtils from '@furude-utils/StringUtils';
import ApiManager from '@furude-osu/API/ApiManager';
import { Beatmap as ApiBeatmap } from 'node-osu';
import { StarRatingCalculationParameters } from '@furude-utils/dpp/StarRatingCalculationParameters';
import { PerformanceCalculationParameters } from '@furude-utils/dpp/PerformanceCalculationParameters';
import ModUtils from '@furude-osu/Utils/ModUtils';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';

class OsuCalc extends SubCommandABC {
  private urlOption: SlashCommandStringOption;
  private calcParams: SlashCommandStringOption;
  private isDroidOption: SlashCommandBooleanOption;

  public constructor() {
    super();
    this.setName('calc')
      .setDescription('Calculates a osu!beatmap')
      .addStringOption(
        (this.urlOption = new SlashCommandStringOption()
          .setName('url')
          .setDescription('The desired beatmap url.')
          .setRequired(true))
      )
      .addStringOption(
        (this.calcParams = new SlashCommandStringOption()
          .setName('calc_params')
          .setDescription('The params used for beatmap calculation.'))
      )
      .addBooleanOption(
        (this.isDroidOption = new SlashCommandBooleanOption()
          .setName('is_droid')
          .setDescription('Wether to calculate beatmap using droid pp system'))
      );
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const url = interaction.options.getString(this.urlOption.name, true);
    const isDroid = interaction.options.getBoolean(this.isDroidOption.name);
    const calcParams = BeatmapDifficultyHelper.getCalculationParamsFromMessage(
      interaction.options.getString(this.calcParams.name) ?? ''
    );

    const calculator = isDroid
      ? new DroidPerformanceCalculator()
      : new OsuPerformanceCalculator();

    const parser = new Parser();

    const beatmapID = url?.split('/').at(-1);

    let apiMap: ApiBeatmap;
    try {
      apiMap = (await ApiManager.banchoApi.getBeatmaps({ b: beatmapID }))[0];
    } catch (err) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(interaction, LocalizeTags.mapNotFound)
        )
      );
      return;
    }

    const osu = await MapUtils.getBeatmapOsu(beatmapID!);

    const map = parser.parse(osu, calcParams.mods).map;
    calcParams.accuracy = new Accuracy({
      nobjects: map.objects.length,
      ...calcParams.accuracy,
      percent: calcParams.inputAccuracy
    });

    if (calculator instanceof OsuPerformanceCalculator) {
      calculator.calculate({
        stars: calculator.stars.calculate({
          map,
          mods: calcParams.mods,
          stats: calcParams.customStatistics
        }),
        accPercent: calcParams.accuracy,
        combo: calcParams.combo
      });
    } else {
      calculator.calculate({
        stars: calculator.stars.calculate({
          map,
          mods: calcParams.mods,
          stats: calcParams.customStatistics
        }),
        accPercent: calcParams.accuracy,
        combo: calcParams.combo
      });
    }

    const calcEmbed = this.createCalcEmbed(
      interaction,
      calculator,
      apiMap,
      calcParams,
      map
    );

    await interaction.editReply({
      embeds: [calcEmbed]
    });
  }

  private createCalcEmbed(
    interaction: CommandInteraction,
    calculator: PerformanceCalculator,
    apiMap: ApiBeatmap,
    calcParams: PerformanceCalculationParameters,
    map: Beatmap
  ): BotEmbed {
    const acc = calcParams.accuracy;

    const title = `${apiMap.artist} - ${apiMap.title} (${apiMap.creator}) [${
      apiMap.version
    }] ${ModUtils.getStringRepr(calcParams.mods)}`;

    const info = `Circles: ${map.circles} - Sliders: ${
      map.sliders
    } - Spinners: ${map.spinners}\nCS: ${map.cs} - AR: ${map.ar} - OD: ${
      map.od
    } - HP: ${map.hp}\nBPM: ${
      apiMap.bpm
    } - Max Combo: ${map.maxCombo()}x\nResult: ${
      calcParams.combo ?? map.maxCombo()
    }/${map.maxCombo()}x | ${(acc.value() * 100).toFixed(2)}% | [${acc.n300}/${
      acc.n100
    }/${acc.n50}/${acc.nmiss}]\nStars: ${calculator.stars.total.toFixed(
      2
    )}\nPP: ${calculator.total.toFixed(2)}
    `;

    return new BotEmbed(interaction)
      .setDescription(
        StringUtils.boldString(
          `${StringUtils.hyperLink(
            title,
            MapUtils.getBeatmapUrl(apiMap.id)
          )}\n${info}`
        )
      )
      .setThumbnail(MapUtils.getThumbnailUrl(apiMap.beatmapSetId))
      .setAuthor(
        calculator instanceof OsuPerformanceCalculator
          ? 'STD CALC'
          : 'DROID CALC'
      );
  }
}

export default OsuCalc;
