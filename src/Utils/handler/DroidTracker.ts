import ApiManager from '@furude-osu/API/ApiManager';
import { Client, TextChannel } from 'discord.js';
import OsuUserHelper from '@furude-osu/Users/OsuUserHelper';
import RecentScoreEmbed from '@discord-classes/Embed/RecentScoreEmbed';
import StringUtils from '@furude-utils/StringUtils';
import FastTS from '@furude-localization/FastTS';
import OsuServers from '@furude-osu/Servers/OsuServers';
import PPHelper from '@furude-utils/pp/PPHelper';

class DroidTracker {
  private privilegedUIDS: number[] = [
    158287, 308510, 149922, 192859, 235597, 127259, 124634, 195772, 199062
  ];
  private trackChannelID: string = '886098861393858560';
  private trackChannel: TextChannel | null = null;
  private client;

  public constructor(client: Client) {
    this.client = client;
  }

  public async startTracking(): Promise<void> {
    if (!this.trackChannel) {
      const channel = await this.client.channels.fetch(
        this.trackChannelID.toString()
      );
      if (channel && channel instanceof TextChannel) {
        this.trackChannel = channel;
      }
    }

    const time = 600 * 1000;
    setInterval(async () => {
      for await (const uid of this.privilegedUIDS) {
        const user = await ApiManager.droidApi.getUser(uid.toString());

        if (!OsuUserHelper.userExists(user)) {
          continue;
        }

        const scores = await user.getScores({});
        const currentTime: Date = new Date();

        let i = -1;
        for await (const score of scores) {
          i++;
          const date = score.date as Date;

          if (currentTime.getTime() - date.getTime() > time) {
            break;
          }

          await PPHelper.calculateScore(score, OsuServers.droid);
          const embed = new RecentScoreEmbed(score, null);

          await this.trackChannel?.send({
            content: StringUtils.successString(
              FastTS.recentScore(user, OsuServers.droid, i)
            ),
            embeds: [embed]
          });
        }
      }
    }, time);
  }
}

export default DroidTracker;
