import { Channel, Message, Prisma, Team, User } from "@prisma/client";
import sqlite3 from "better-sqlite3-helper";
import { Dayjs } from "dayjs";
import os from "os";
import path from "path";

const DB_PATH = path.join(os.homedir(), ".slack-stock.db");

const db = sqlite3({
  path: DB_PATH,
  memory: false,
  readonly: false,
  fileMustExist: false,
  migrate: false,
});

db.exec(`
-- CreateTable
CREATE TABLE IF NOT EXISTS "teams" (
    "team_id" TEXT NOT NULL PRIMARY KEY,
    "team_name" TEXT NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "team_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "is_admin" INTEGER NOT NULL,
    "is_owner" INTEGER NOT NULL,
    "is_primary_owner" INTEGER NOT NULL,
    "is_restricted" INTEGER NOT NULL,
    "is_ultra_restricted" INTEGER NOT NULL,
    "is_app_user" INTEGER NOT NULL,
    "is_bot" INTEGER NOT NULL,
    "deleted" INTEGER NOT NULL,
    CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams" ("team_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "channels" (
    "channel_id" TEXT NOT NULL PRIMARY KEY,
    "team_id" TEXT NOT NULL,
    "channel_name" TEXT NOT NULL,
    "is_channel" INTEGER NOT NULL,
    "is_group" INTEGER NOT NULL,
    "is_im" INTEGER NOT NULL,
    "is_mpim" INTEGER NOT NULL,
    "is_private" INTEGER NOT NULL,
    "is_archived" INTEGER NOT NULL,
    "is_general" INTEGER NOT NULL,
    "is_shared" INTEGER NOT NULL,
    "is_org_shared" INTEGER NOT NULL,
    "is_pending_ext_shared" INTEGER NOT NULL,
    "is_ext_shared" INTEGER NOT NULL,
    CONSTRAINT "channels_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams" ("team_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "messages" (
    "message_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "team_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ts" TEXT NOT NULL,
    "date_tz" TEXT NOT NULL,
    "time_tz" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "messages_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams" ("team_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE VIRTUAL TABLE IF NOT EXISTS "v_messages" USING fts5(
    "message_id",
    "text"
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "messages_team_id_channel_id_user_id_ts_type_key" ON "messages"("team_id", "channel_id", "user_id", "ts", "type");

`);

export const DB_CLIENT = {
  teams: {
    findMany(): Team[] {
      return Array.from(
        db.queryIterate(`
          SELECT
              team_id
            , team_name
            , token
          FROM
            teams
          `)
      );
    },
    findUnique({ team_id, team_name }: RequireOne<Prisma.TeamWhereUniqueInput>): Team | undefined {
      return db.queryFirstRow(
        `
          SELECT
              team_id
            , team_name
            , token
          FROM
            teams
          WHERE
            ${team_id ? "team_id = @team_id" : "team_name = @team_name"}
          `,
        {
          team_id,
          team_name,
        }
      );
    },
    upsert(team: Team) {
      return db.run(
        `
          INSERT INTO teams (
              team_id
            , team_name
            , token
          ) VALUES (
              @team_id
            , @team_name
            , @token
          ) ON CONFLICT (
            team_id
          ) DO UPDATE SET
              team_id   = @team_id
            , team_name = @team_name
            , token     = @token
                `,
        team
      );
    },
  },
  users: {
    findMany(params: { team_id?: string } = {}): (User & Pick<Team, "team_id" | "team_name">)[] {
      return Array.from(
        db.queryIterate(
          `
          SELECT
              users.team_id
            , teams.team_name
            , users.user_id
            , users.user_name
            , users.is_admin
            , users.is_owner
            , users.is_primary_owner
            , users.is_restricted
            , users.is_ultra_restricted
            , users.is_app_user
            , users.is_bot
            , users.deleted
          FROM
            users
            LEFT OUTER JOIN teams
              ON users.team_id = teams.team_id
          ${
            params.team_id
              ? `
          WHERE
            users.team_id = @team_id
          `
              : ""
          }
          `,
          params
        )
      );
    },
    findUnique(user_id: string): (User & Pick<Team, "team_id" | "team_name">) | undefined {
      return db.queryFirstRow(
        `
          SELECT
              users.team_id
            , teams.team_name
            , users.user_id
            , users.user_name
            , users.is_admin
            , users.is_owner
            , users.is_primary_owner
            , users.is_restricted
            , users.is_ultra_restricted
            , users.is_app_user
            , users.is_bot
            , users.deleted
          FROM
            users
          WHERE
            user_id = @user_id
          `,
        {
          user_id,
        }
      );
    },
    upsert(user: User) {
      return db.run(
        `
          INSERT INTO users (
              user_id
            , team_id
            , user_name
            , is_admin
            , is_owner
            , is_primary_owner
            , is_restricted
            , is_ultra_restricted
            , is_app_user
            , is_bot
            , deleted
          ) VALUES (
              @user_id
            , @team_id
            , @user_name
            , @is_admin
            , @is_owner
            , @is_primary_owner
            , @is_restricted
            , @is_ultra_restricted
            , @is_app_user
            , @is_bot
            , @deleted
          ) ON CONFLICT (
            user_id
          ) DO UPDATE SET
              team_id             = @team_id
            , user_name           = @user_name
            , is_admin            = @is_admin
            , is_owner            = @is_owner
            , is_primary_owner    = @is_primary_owner
            , is_restricted       = @is_restricted
            , is_ultra_restricted = @is_ultra_restricted
            , is_app_user         = @is_app_user
            , is_bot              = @is_bot
            , deleted             = @deleted
      `,
        user
      );
    },
  },
  channels: {
    findMany(params: { team_id?: string } = {}): (Channel & Team)[] {
      return Array.from(
        db.queryIterate(
          `
          SELECT
              channels.team_id
            , teams.team_name
            , channels.channel_id
            , channels.channel_name
            , teams.token
            , channels.is_channel
            , channels.is_group
            , channels.is_im
            , channels.is_mpim
            , channels.is_private
            , channels.is_archived
            , channels.is_general
            , channels.is_shared
            , channels.is_org_shared
            , channels.is_pending_ext_shared
            , channels.is_ext_shared
          FROM
            channels
            LEFT OUTER JOIN teams
              ON channels.team_id = teams.team_id
          ${
            params.team_id
              ? `
          WHERE
            channels.team_id = @team_id
          `
              : ""
          }
          `,
          params
        )
      );
    },
    findUnique(channel_id: string): (Channel & Team) | undefined {
      return db.queryFirstRow(
        `
          SELECT
              channels.team_id
            , teams.team_name
            , channels.channel_id
            , channels.channel_name
            , teams.token
            , channels.is_channel
            , channels.is_group
            , channels.is_im
            , channels.is_mpim
            , channels.is_private
            , channels.is_archived
            , channels.is_general
            , channels.is_shared
            , channels.is_org_shared
            , channels.is_pending_ext_shared
            , channels.is_ext_shared
          FROM
            channels
            LEFT OUTER JOIN teams
              ON channels.team_id = teams.team_id
          WHERE
            channels.channel_id = @channel_id
          `,
        {
          channel_id,
        }
      );
    },
    upsert(channel: Channel) {
      return db.run(
        `
          INSERT INTO channels (
              channel_id
            , team_id
            , channel_name
            , is_channel
            , is_group
            , is_im
            , is_mpim
            , is_private
            , is_archived
            , is_general
            , is_shared
            , is_org_shared
            , is_pending_ext_shared
            , is_ext_shared
          ) VALUES (
              @channel_id
            , @team_id
            , @channel_name
            , @is_channel
            , @is_group
            , @is_im
            , @is_mpim
            , @is_private
            , @is_archived
            , @is_general
            , @is_shared
            , @is_org_shared
            , @is_pending_ext_shared
            , @is_ext_shared
          ) ON CONFLICT (
            channel_id
          ) DO UPDATE SET
              team_id               = @team_id
            , channel_name          = @channel_name
            , is_channel            = @is_channel
            , is_group              = @is_group
            , is_im                 = @is_im
            , is_mpim               = @is_mpim
            , is_private            = @is_private
            , is_archived           = @is_archived
            , is_general            = @is_general
            , is_shared             = @is_shared
            , is_org_shared         = @is_org_shared
            , is_pending_ext_shared = @is_pending_ext_shared
            , is_ext_shared         = @is_ext_shared
                `,
        channel
      );
    },
  },
  messages: {
    findMany(params: {
      channel_id: string;
      oldest: Dayjs;
      latest: Dayjs;
    }): (Message & Pick<Team, "team_name"> & Pick<Channel, "channel_name"> & Pick<User, "user_name">)[] {
      return Array.from(
        db.queryIterate(
          `
          SELECT
              messages.team_id
            , teams.team_name
            , messages.channel_id
            , channels.channel_name
            , messages.user_id
            , users.user_name
            , messages.message_id
            , messages.ts
            , messages.date_tz
            , messages.time_tz
            , messages.type
            , messages.text
          FROM
            messages
            LEFT OUTER JOIN teams
              ON messages.team_id = teams.team_id
            LEFT OUTER JOIN channels
              ON messages.channel_id = channels.channel_id
            LEFT OUTER JOIN users
              ON messages.user_id = users.user_id
          WHERE
            messages.channel_id = @channel_id
            AND messages.ts BETWEEN @oldest AND @latest
          `,
          {
            channel_id: params.channel_id,
            oldest: String(params.oldest.unix()),
            latest: String(params.latest.unix()),
          }
        )
      );
    },
    vFindMany(params: {
      text: string;
    }): (Message &
      Pick<Team, "team_name"> &
      Pick<Channel, "channel_name"> &
      Pick<User, "user_name"> & { rank: number })[] {
      return Array.from(
        db.queryIterate(
          `
          SELECT
              rank
            , messages.team_id
            , teams.team_name
            , messages.channel_id
            , channels.channel_name
            , messages.user_id
            , users.user_name
            , messages.message_id
            , messages.ts
            , messages.date_tz
            , messages.time_tz
            , messages.type
            , messages.text
          FROM
            v_messages
            INNER JOIN messages
              ON v_messages.message_id = messages.message_id
            LEFT OUTER JOIN teams
              ON messages.team_id = teams.team_id
            LEFT OUTER JOIN channels
              ON messages.channel_id = channels.channel_id
            LEFT OUTER JOIN users
              ON messages.user_id = users.user_id
          WHERE
            v_messages.text MATCH @text
          ORDER BY
            rank ASC
          `,
          params
        )
      );
    },
    vFindManyTimer(params: {
      channel_id: string;
      oldest: Dayjs;
      latest: Dayjs;
      startKeyword: string;
      endKeyword: string;
    }): (Pick<Team, "team_id" | "team_name"> &
      Pick<Channel, "channel_id" | "channel_name"> &
      Pick<User, "user_id" | "user_name"> &
      Pick<Message, "date_tz"> & {
        start_ts: string;
        start_time_tz: string;
        start_type: string;
        start_text: string;
        end_ts: string;
        end_time_tz: string;
        end_type: string;
        end_text: string;
      })[] {
      return Array.from(
        db.queryIterate(
          `
          SELECT
            -- common
              START_KEYWORD.team_id
            , teams.team_name
            , START_KEYWORD.channel_id
            , channels.channel_name
            , START_KEYWORD.user_id
            , users.user_name
            , START_KEYWORD.date_tz
            -- start
            , START_KEYWORD.ts AS start_ts
            , START_KEYWORD.time_tz AS start_time_tz
            , START_KEYWORD.type AS start_type
            , START_KEYWORD.text AS start_text
            -- end
            , END_KEYWORD.ts AS end_ts
            , END_KEYWORD.time_tz AS end_time_tz
            , END_KEYWORD.type AS end_type
            , END_KEYWORD.text AS end_text
          FROM
            (
              SELECT
                  rank
                , messages.team_id
                , messages.channel_id
                , messages.user_id
                , messages.ts
                , messages.date_tz
                , messages.time_tz
                , messages.type
                , messages.text
              FROM
                v_messages
                INNER JOIN messages
                  ON v_messages.message_id = messages.message_id
                  AND messages.channel_id = @channel_id
              WHERE
                v_messages.text MATCH @startKeyword
              GROUP BY
                messages.team_id
                , messages.channel_id
                , messages.user_id
                , messages.date_tz
              ORDER BY
                rank ASC
            ) AS START_KEYWORD
              LEFT OUTER JOIN
            (
              SELECT
                  rank
                , messages.team_id
                , messages.channel_id
                , messages.user_id
                , messages.ts
                , messages.date_tz
                , messages.time_tz
                , messages.type
                , messages.text
              FROM
                v_messages
                INNER JOIN messages
                  ON v_messages.message_id = messages.message_id
                  AND messages.channel_id = @channel_id
              WHERE
                v_messages.text MATCH @endKeyword
              GROUP BY
                messages.team_id
                , messages.channel_id
                , messages.user_id
                , messages.date_tz
              ORDER BY
                rank ASC
            ) AS END_KEYWORD
              ON START_KEYWORD.team_id      = END_KEYWORD.team_id
              AND START_KEYWORD.channel_id  = END_KEYWORD.channel_id
              AND START_KEYWORD.user_id     = END_KEYWORD.user_id
              AND START_KEYWORD.date_tz     = END_KEYWORD.date_tz
              LEFT OUTER JOIN teams
                ON START_KEYWORD.team_id = teams.team_id
              LEFT OUTER JOIN channels
                ON START_KEYWORD.channel_id = channels.channel_id
              LEFT OUTER JOIN users
                ON START_KEYWORD.user_id = users.user_id
            ORDER BY
              START_KEYWORD.team_id ASC
              , START_KEYWORD.channel_id ASC
              , START_KEYWORD.user_id ASC
              , START_KEYWORD.date_tz ASC
          `,
          {
            channel_id: params.channel_id,
            oldest: params.oldest,
            latest: params.latest,
            startKeyword: params.startKeyword,
            endKeyword: params.endKeyword,
          }
        )
      );
    },
    findUnique(params: {
      team_id: string;
      channel_id: string;
      type: string;
      user_id: string;
      ts: string;
    }): (Message & Pick<Team, "team_name"> & Pick<Channel, "channel_name"> & Pick<User, "user_name">) | undefined {
      return db.queryFirstRow(
        `
          SELECT
              messages.team_id
            , teams.team_name
            , messages.channel_id
            , channels.channel_name
            , messages.user_id
            , users.user_name
            , messages.message_id
            , messages.ts
            , messages.date_tz
            , messages.time_tz
            , messages.type
            , messages.text
          FROM
            messages
            LEFT OUTER JOIN teams
              ON messages.team_id = teams.team_id
            LEFT OUTER JOIN channels
              ON messages.channel_id = channels.channel_id
            LEFT OUTER JOIN users
              ON messages.user_id = users.user_id
          WHERE
            team_id         = @team_id
            AND channel_id  = @channel_id
            AND user_id     = @user_id
            AND ts          = @ts
            AND type        = @type
          `,
        params
      );
    },
    vFindUnique(params: { message_id: number }): Pick<Message, "message_id"> | undefined {
      return db.queryFirstRow(
        `
          SELECT
            message_id
          FROM
            v_messages
          WHERE
            message_id = @message_id
      `,
        {
          message_id: String(params.message_id),
        }
      );
    },
    upsert(message: Prisma.MessageUncheckedCreateInput): Message | undefined {
      return db.queryFirstRow(
        `
          INSERT INTO messages (
              team_id
            , channel_id
            , user_id
            , ts
            , date_tz
            , time_tz
            , type
            , text
          ) VALUES (
              @team_id
            , @channel_id
            , @user_id
            , @ts
            , @date_tz
            , @time_tz
            , @type
            , @text
          ) ON CONFLICT (
            team_id, channel_id, user_id, ts, type
          ) DO UPDATE SET
            text = @text
          RETURNING *
      `,
        message
      );
    },
    vUpdate(params: { message_id: number; text: string }) {
      return db.run(
        `
          UPDATE v_messages
          SET text = @text
          WHERE message_id = @message_id
      `,
        {
          message_id: String(params.message_id),
          text: params.text,
        }
      );
    },
    vInsert(params: { message_id: number; text: string }) {
      return db.run(
        `
          INSERT INTO v_messages (
              message_id
            , text
          ) VALUES (
              @message_id
            , @text
          )
      `,
        {
          message_id: String(params.message_id),
          text: params.text,
        }
      );
    },
  },
};
