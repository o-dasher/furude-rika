import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
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
        Localizer.getLocaleString(interaction, LocalizeTags.missingPermissions)
      );
    }

    return hasPermissions;
  }
}

export default CommandHelper;
