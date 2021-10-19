import { Channel, Message, Prisma, User } from "@prisma/client";
import sqlite3 from "better-sqlite3-helper";
import { DB_PATH } from "./const";

const db = sqlite3({
  path: DB_PATH,
  memory: false,
  readonly: false,
  fileMustExist: false,
  migrate: false,
});

db.exec(`
-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "team_id" TEXT NOT NULL,
    "real_name" TEXT NOT NULL,
    "is_admin" INTEGER NOT NULL,
    "is_owner" INTEGER NOT NULL,
    "is_primary_owner" INTEGER NOT NULL,
    "is_restricted" INTEGER NOT NULL,
    "is_ultra_restricted" INTEGER NOT NULL,
    "is_app_user" INTEGER NOT NULL,
    "is_bot" INTEGER NOT NULL,
    "deleted" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "channels" (
    "channel_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
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
    "is_ext_shared" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "messages" (
    "message_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ts" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "messages_channel_id_user_id_ts_type_key" ON "messages"("channel_id", "user_id", "ts", "type");

`);

export const mapper = {
  message: {
    findMany(channel_id: string, oldest: Date, latest: Date): Message[] {
      return Array.from(
        db.queryIterate(
          `
SELECT
    message_id
  , channel_id
  , user_id
  , ts
  , type
  , text
FROM
  messages
WHERE
  channel_id = @channel_id
  AND ts BETWEEN @oldest AND @latest
`,
          {
            channel_id,
            oldest: String(Math.floor(oldest.getTime() / 1000)),
            latest: String(Math.floor(latest.getTime() / 1000)),
          }
        )
      );
    },
    findUnique(
      channel_id: string,
      type: string,
      user_id: string,
      ts: string
    ): Message | undefined {
      return db.queryFirstRow(
        `
SELECT
    message_id
  , channel_id
  , user_id
  , ts
  , type
  , text
FROM
  messages
WHERE
  channel_id  = @channel_id
  AND type    = @type
  AND user_id = @user_id
  AND ts      = @ts
`,
        {
          channel_id,
          type,
          user_id,
          ts,
        }
      );
    },
    upsert(message: Prisma.MessageUncheckedCreateInput) {
      return db.run(
        `
INSERT INTO messages (
    channel_id
  , user_id
  , ts
  , type
  , text
) VALUES (
    @channel_id
  , @user_id
  , @ts
  , @type
  , @text
) ON CONFLICT (
  channel_id, user_id, ts, type
) DO UPDATE SET
    channel_id  = @channel_id
  , user_id     = @user_id
  , ts          = @ts
  , type        = @type
  , text        = @text
      `,
        message
      );
    },
  },
  user: {
    findMany(): User[] {
      return Array.from(
        db.queryIterate(`
SELECT
  user_id
  , team_id
  , real_name
  , is_admin
  , is_owner
  , is_primary_owner
  , is_restricted
  , is_ultra_restricted
  , is_app_user
  , is_bot
  , deleted
FROM
  users
`)
      );
    },
    findUnique(user_id: string): User | undefined {
      return db.queryFirstRow(
        `
SELECT
  user_id
  , team_id
  , real_name
  , is_admin
  , is_owner
  , is_primary_owner
  , is_restricted
  , is_ultra_restricted
  , is_app_user
  , is_bot
  , deleted
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
  , real_name
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
  , @real_name
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
  , real_name           = @real_name
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
  channel: {
    findMany(): Channel[] {
      return Array.from(
        db.queryIterate(`
SELECT
    channel_id
  , name
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
FROM
  channels
`)
      );
    },
    findUnique(channel_id: string): Channel | undefined {
      return db.queryFirstRow(
        `
SELECT
    channel_id
  , name
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
FROM
  channels
WHERE
  channel_id = @channel_id
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
  , name
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
  , @name
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
    name                  = @name
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
};
