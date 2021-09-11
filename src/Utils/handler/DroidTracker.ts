import ApiManager from '@furude-osu/API/ApiManager';
import { Client, Collection, TextChannel } from 'discord.js';
import OsuUserHelper from '@furude-osu/Users/OsuUserHelper';
import RecentScoreEmbed from '@discord-classes/Embed/RecentScoreEmbed';
import StringUtils from '@furude-utils/StringUtils';
import FastTS from '@furude-localization/FastTS';
import OsuServers from '@furude-osu/Servers/OsuServers';
import PPHelper from '@furude-utils/pp/PPHelper';

interface TrackEntry {
  channel: TextChannel;
  trackIDS: number[];
}

class DroidTracker {
  private trackChannelIDS: string[] = ['886098861393858560'];
  private trackEntries: TrackEntry[] = [];
  private client: Client;
  private time: number = 600 * 1000;
  private runnedStart: boolean = false;

  public constructor(client: Client) {
    this.client = client;
  }

  public async startTracking(): Promise<void> {
    if (this.runnedStart) {
      throw StringUtils.errorString(
        'StartTracking() should be only executed once!'
      );
    }

    this.runnedStart = true;

    const brTrackChannel = await this.client.channels.fetch(
      '886098861393858560'
    );
    if (brTrackChannel && brTrackChannel instanceof TextChannel) {
      this.trackEntries.push({
        channel: brTrackChannel,
        trackIDS: [
          158287, 308510, 149922, 192859, 235597, 127259, 124634, 195772,
          199062, 167316
        ]
      });
    }

    for await (const id of this.trackChannelIDS) {
      const cacheChannel = this.trackEntries.find((c) => c.channel.id == id);
      if (!cacheChannel) {
        const channel = await this.client.channels.fetch(id);
        if (channel && channel instanceof TextChannel) {
          this.trackEntries.push({
            channel,
            trackIDS: []
          });
        }
      }
    }

    setInterval(async () => await this.update(), this.time);
  }

  private async update(): Promise<void> {
    for await (const entry of this.trackEntries) {
      for await (const uid of entry.trackIDS) {
        const user = await ApiManager.droidApi.getUser(uid.toString());

        if (!OsuUserHelper.userExists(user)) {
          continue;
        }

        const scores = await user.getScores({});
        const currentTime: Date = new Date();

        for await (const [i, score] of scores.entries()) {
          score.date = score.date as Date;
          const delta = currentTime.getTime() - score.date.getTime();

          if (delta > this.time) {
            break;
          }

          await PPHelper.calculateScore(score, OsuServers.droid);
          const embed = new RecentScoreEmbed(score, null);

          await entry.channel.send({
            content: StringUtils.successString(
              FastTS.recentScore(user, OsuServers.droid, i)
            ),
            embeds: [embed]
          });
        }
      }
    }
  }
}

export default DroidTracker;
