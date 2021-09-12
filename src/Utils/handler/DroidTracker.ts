import ApiManager from '@furude-osu/API/ApiManager';
import { Client, TextChannel } from 'discord.js';
import OsuUserHelper from '@furude-osu/Users/OsuUserHelper';
import RecentScoreEmbed from '@discord-classes/Embed/RecentScoreEmbed';
import StringUtils from '@furude-utils/StringUtils';
import FastTS from '@furude-localization/FastTS';
import OsuServers from '@furude-osu/Servers/OsuServers';
import PPHelper from '@furude-utils/pp/PPHelper';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import FurudeDB from '@furude-db/FurudeDB';
import DBPaths from '@furude-db/DBPaths';
import DBGuild from '@furude-db/DBGuild';

class DroidTracker {
  private client: Client;
  private time: number = 1000 * 60 * 15;
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
    setIntervalAsync(async () => await this.update(), this.time);
  }

  private async update(): Promise<void> {
    const guilds = await FurudeDB.db().collection(DBPaths.guilds).get();
    for await (const doc of guilds.docs) {
      const dbGuild = { ...new DBGuild(), ...doc.data() } as DBGuild;
      let trackChannel: TextChannel | null = null;
      if (parseInt(dbGuild.osu.trackChannelID)) {
        const channel = await this.client.channels.fetch(
          dbGuild.osu.trackChannelID
        );
        if (!channel || !(channel instanceof TextChannel)) {
          continue;
        }
        trackChannel = channel;
      } else {
        continue;
      }
      for await (const uid of dbGuild.osu.trackIDS) {
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
          const embed = new RecentScoreEmbed(score, null, {
            color: trackChannel.guild.me?.displayColor
          });

          if (trackChannel) {
            await trackChannel.send({
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
}

export default DroidTracker;
