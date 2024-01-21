import { PrismaClient as OriginPrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import util from 'node:util';
import os from 'os';
import path from 'path';
import { debug } from '~/lib/debug';
import { decrypt, encrypt } from '~/middleware/password';

const DATABASE_URL = path.join('file:', os.homedir(), '.slack-stock.db');

const originPrisma = new OriginPrismaClient({
  datasources: { db: { url: DATABASE_URL } }, // TODO build して実行環境に配布されたとき scema.prisma に定義した環境変数 $HOME はどう解釈される？
  log: ['error', { emit: 'event', level: 'query' }],
});

originPrisma.$on('query', (event) => {
  debug.log(`QUERY::[${event.query};]`, event.params !== '[]' ? `PARAMS::${event.params}` : '');
});

export const prisma = originPrisma.$extends({
  query: {
    async $allOperations(params) {
      debug.log(`${params.operation}.${params.model} BEGIN ================>`);
      const start = performance.now();

      const result = await params.query(params.args);

      const end = performance.now();
      debug.log(
        `<================ ${params.operation}.${params.model} END`,
        `took::${end - start}ms`,
      );
      debug.log('RESULT::', util.inspect(result, { showHidden: false, depth: null, colors: true }));
      return result;
    },
    team: {
      async findMany({ args, query }) {
        if (typeof args.where?.token === 'string') {
          args.where.token = encrypt(args.where.token);
        }
        return query(args);
      },
      async findUnique({ args, query }) {
        if (typeof args.where?.token === 'string') {
          args.where.token = encrypt(args.where.token);
        }
        return query(args);
      },
      async findFirst({ args, query }) {
        if (typeof args.where?.token === 'string') {
          args.where.token = encrypt(args.where.token);
        }
        return query(args);
      },
      async upsert({ args, query }) {
        args.create.token = encrypt(args.create.token);
        if (args.update.token === 'string') {
          args.update.token = encrypt(args.update.token);
        }
        if (typeof args.where?.token === 'string') {
          args.where.token = encrypt(args.where.token);
        }
        return query(args);
      },
    },
  },
  result: {
    team: {
      token: {
        needs: { token: true },
        compute(team) {
          return decrypt(team.token);
        },
      },
    },
  },
});

type ExtendsPrismaClient = typeof prisma;
type TransactionExtendsPrismaClient = Omit<ExtendsPrismaClient, ITXClientDenyList>;

export type PrismaClient = ExtendsPrismaClient | TransactionExtendsPrismaClient;

export async function createTableIfNotExists() {
  // 実行環境でのデータベース作成
  // 開発環境は schema.prisma に定義した url = DATABASE_URL なので処理なし
  // prisma/migrations/ xxx /migration.sql で作られるファイルと一緒
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "teams" (
        "team_id" TEXT NOT NULL PRIMARY KEY,
        "team_name" TEXT NOT NULL,
        "token" TEXT NOT NULL
    )`;

  await prisma.$executeRaw`
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
    )`;

  await prisma.$executeRaw`
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
    )`;

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "messages" (
        "client_msg_id" TEXT NOT NULL PRIMARY KEY,
        "team_id" TEXT NOT NULL,
        "channel_id" TEXT NOT NULL,
        "user_id" TEXT,
        "ts" TEXT NOT NULL DEFAULT '',
        "date_tz" TEXT NOT NULL DEFAULT '',
        "time_tz" TEXT NOT NULL DEFAULT '',
        "type" TEXT NOT NULL DEFAULT '',
        "text" TEXT NOT NULL DEFAULT '',
        "thread_ts" TEXT NOT NULL DEFAULT '',
        CONSTRAINT "messages_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams" ("team_id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE
    )`;

  await prisma.$executeRaw`
    CREATE VIRTUAL TABLE IF NOT EXISTS "v_messages" USING fts5(
        "client_msg_id",
        "text"
    )`;
}
