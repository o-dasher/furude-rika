import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import StringUtils from '@furude-utils/StringUtils';
import { CommandInteraction, GuildMember } from 'discord.js';

abstract class CommandHelper {
  private constructor() {}

  public static async checkPermissions(
    interaction: CommandInteraction,
    permissions: bigint[]
  ): Promise<boolean> {
    const hasPermissions =
      interaction.member instanceof GuildMember
        ? interaction.member.permissions.has(permissions)
        : false;

    if (!hasPermissions) {
      await interaction.editReply(
        StringUtils.errorString(
          Localizer.getLocaleString(
            interaction,
            LocalizeTags.missingPermissions
          )
        )
      );
    }

    return hasPermissions;
  }
}

export default CommandHelper;
