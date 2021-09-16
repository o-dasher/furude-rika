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
import Task from './Task';
import BotEmbed from '@discord-classes/Embed/BotEmbed';

class OsuTracker extends Task {
  public override name: string = 'osu_tracker';
  private time: number = 1000 * 60 * 15;

  public constructor(client: Client) {
    super(client);
  }

  protected override async onStart(): Promise<void> {
    setIntervalAsync(async () => await this.update(), this.time);
  }

  private async update(): Promise<void> {
    const currentTime: Date = new Date();
    const guilds = await FurudeDB.db().collection(DBPaths.guilds).get();
    const cachedUsers: OsuUser[] = [];

    for await (const doc of guilds.docs) {
      const dbGuild: DBGuild = Object.assign(new DBGuild(), doc.data());
      let trackChannel: TextChannel | null = null;
      let leaderBoardChannel: TextChannel | null = null;

      try {
        const tmpTrackChannel = await this.client.channels.fetch(
          dbGuild.osu.trackChannelID
        );
        trackChannel =
          tmpTrackChannel instanceof TextChannel ? tmpTrackChannel : null;
      } catch (err) {}
      try {
        const tmpLeaderBoardChannel = await this.client.channels
          .fetch(dbGuild.osu.leaderboardChannelID)
          .catch();
        leaderBoardChannel =
          tmpLeaderBoardChannel instanceof TextChannel
            ? tmpLeaderBoardChannel
            : null;
      } catch (err) {}

      if (trackChannel) {
        consolaGlobalInstance.success(
          `Started tracking osu! users for ${trackChannel.guild.name}`
        );
      }

      const guildTrackedUsers: OsuUser[] = [];
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
            true
          )).osuUser;

        if (
          (newUserRes && newUserRes.err) ||
          !user ||
          !OsuUserHelper.userExists(user)
        ) {
          continue;
        }

        guildTrackedUsers.push(user);
        if (!cachedUser) {
          cachedUsers.push(user);
        }

        const scores = await user.getScores({});

        if (trackChannel) {
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

            await trackChannel.send({
              content: StringUtils.successString(
                FastTS.recentScore(user, OsuServers.droid, i)
              ),
              embeds: [embed]
            });
          }
        }
      }
      if (leaderBoardChannel) {
        const lbEmbed = new BotEmbed();
        guildTrackedUsers.sort((a, b) => Number(b.pp?.raw) - Number(a.pp?.raw));
        lbEmbed.description = '';
        for (const [i, u] of guildTrackedUsers.entries()) {
          lbEmbed.description += `${i + 1} - **${
            u.name
          }**: ${u.pp?.raw?.toFixed(2)}\n`;
        }
        await leaderBoardChannel.send({
          content: StringUtils.successString(
            `Leaderboard for ${leaderBoardChannel.guild.name}`
          ),
          embeds: [lbEmbed],
        });
      }
    }
  }
}

export default OsuTracker;
