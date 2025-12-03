import { db, schema } from "./db";
import { eq, desc } from "drizzle-orm";
import type { PlatformUnlockData, PlatformStatus } from "./platform-unlock-parser";
import { platformsToJson, platformsFromJson } from "./platform-unlock-parser";

const { servers, platformUnlocks } = schema;

export interface PlatformUnlockRecord {
  id: number;
  serverId: string;
  ipv4Asn: string | null;
  ipv4Location: string | null;
  platforms: PlatformStatus[];
  rawContent: string | null;
  testTime: string | null;
  createdAt: string;
}

/**
 * 保存平台解锁数据
 */
export async function savePlatformUnlock(
  serverId: string,
  data: PlatformUnlockData,
  rawContent?: string
): Promise<void> {
  const now = new Date();

  // 确保服务器存在
  const existingServer = await db
    .select()
    .from(servers)
    .where(eq(servers.id, serverId))
    .limit(1);

  if (existingServer.length === 0) {
    // 创建服务器记录
    await db.insert(servers).values({
      id: serverId,
      createdAt: now,
      updatedAt: now,
    });
  }

  // 解析测试时间
  let testTime: Date | null = null;
  if (data.testTime) {
    try {
      testTime = new Date(data.testTime);
      if (isNaN(testTime.getTime())) testTime = null;
    } catch {
      testTime = null;
    }
  }

  // 插入平台解锁记录
  await db.insert(platformUnlocks).values({
    serverId,
    ipv4Asn: data.ipv4Asn || null,
    ipv4Location: data.ipv4Location || null,
    platforms: platformsToJson(data.platforms),
    rawContent: rawContent || null,
    testTime,
    createdAt: now,
  });
}

/**
 * 获取服务器最新的平台解锁数据
 */
export async function getLatestPlatformUnlock(
  serverId: string
): Promise<PlatformUnlockRecord | null> {
  const records = await db
    .select()
    .from(platformUnlocks)
    .where(eq(platformUnlocks.serverId, serverId))
    .orderBy(desc(platformUnlocks.createdAt))
    .limit(1);

  if (records.length === 0) return null;

  const record = records[0];
  return {
    id: record.id,
    serverId: record.serverId,
    ipv4Asn: record.ipv4Asn,
    ipv4Location: record.ipv4Location,
    platforms: platformsFromJson(record.platforms),
    rawContent: record.rawContent,
    testTime: record.testTime?.toISOString() || null,
    createdAt: record.createdAt.toISOString(),
  };
}

/**
 * 获取服务器所有平台解锁历史
 */
export async function getPlatformUnlockHistory(
  serverId: string
): Promise<PlatformUnlockRecord[]> {
  const records = await db
    .select()
    .from(platformUnlocks)
    .where(eq(platformUnlocks.serverId, serverId))
    .orderBy(desc(platformUnlocks.createdAt));

  return records.map((record) => ({
    id: record.id,
    serverId: record.serverId,
    ipv4Asn: record.ipv4Asn,
    ipv4Location: record.ipv4Location,
    platforms: platformsFromJson(record.platforms),
    rawContent: record.rawContent,
    testTime: record.testTime?.toISOString() || null,
    createdAt: record.createdAt.toISOString(),
  }));
}
