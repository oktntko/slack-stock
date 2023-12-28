import { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export const prisma = new PrismaClient({});

type TransactionOriginPrismaClient = Omit<PrismaClient, ITXClientDenyList>;

export type OriginPrismaClient = PrismaClient | TransactionOriginPrismaClient;
