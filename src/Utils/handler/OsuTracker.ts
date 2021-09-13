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
import OsuUser from '@furude-osu/Users/OsuUser';
import consolaGlobalInstance from 'consola';

class OsuTracker {
  private client: Client;
  private time: number = 1000 * 60 * 1;
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
    const currentTime: Date = new Date();
    const guilds = await FurudeDB.db().collection(DBPaths.guilds).get();
    const cachedUsers: OsuUser[] = [];

    for await (const doc of guilds.docs) {
      const dbGuild = { ...new DBGuild(), ...doc.data() } as DBGuild;
      let trackChannel: TextChannel | null = null;
      if (!dbGuild.osu.trackChannelID || !dbGuild.osu.tracks) {
        continue;
      }
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
      consolaGlobalInstance.success(
        `Started tracking osu! users for ${trackChannel.guild.name}`
      );
      for await (const track of dbGuild.osu.tracks) {
        const cachedUser = cachedUsers.find((u) => u.id == track.id);
        const server = OsuServers.getFromString(track.server);

        // BANCHO SCORE FETCHING IS GLITCHED BJIR
        if (server !== OsuServers.droid) {
          continue;
        }

        let newUserRes = null;
        const user =
          cachedUser ??
          (newUserRes = await OsuUserHelper.getUserFromServer(
            track.id,
            server,
            undefined,
            undefined,
            undefined,
            false
          )).osuUser;

        if (
          (newUserRes && newUserRes.err) ||
          !user ||
          !OsuUserHelper.userExists(user)
        ) {
          continue;
        }

        if (!cachedUser) {
          cachedUsers.push(user);
        }

        const scores = await user.getScores({});

        for await (const [i, score] of scores.entries()) {
          score.date = score.date as Date;
          const delta = currentTime.getTime() - score.date.getTime();

          if (delta > this.time) {
            break;
          }

          await PPHelper.calculateScore(score, OsuServers.droid);
          if (score.pp < dbGuild.osu!.minPP!) {
            continue;
          }
          const embed = new RecentScoreEmbed(score, server, undefined, {
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

export default OsuTracker;
