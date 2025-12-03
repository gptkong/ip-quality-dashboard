import { db, schema } from "./db";
import { eq, desc } from "drizzle-orm";
import type { ServerDataOrArray, ServerWithMeta } from "./mock-data";

const { servers, detectionRecords } = schema;

/**
 * 保存服务器检测数据
 * - 如果服务器不存在，创建新服务器记录
 * - 如果服务器已存在，更新 updatedAt 时间戳
 * - 始终创建新的检测记录（保留历史）
 * - 支持双栈数据（IPv4 + IPv6 数组）
 * 
 * @param serverId 服务器唯一标识
 * @param data 检测数据（单个或数组），已通过验证
 * Requirements: 1.1, 1.4
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveServerData(serverId: string, data: any): Promise<void> {
  const now = new Date();
  
  // 检查服务器是否存在
  const existingServer = await db
    .select()
    .from(servers)
    .where(eq(servers.id, serverId))
    .limit(1);
  
  if (existingServer.length > 0) {
    // 更新服务器的 updatedAt 时间戳
    await db
      .update(servers)
      .set({ updatedAt: now })
      .where(eq(servers.id, serverId));
  } else {
    // 创建新服务器记录
    await db.insert(servers).values({
      id: serverId,
      createdAt: now,
      updatedAt: now,
    });
  }
  
  // 创建新的检测记录
  await db.insert(detectionRecords).values({
    serverId,
    data: JSON.stringify(data),
    createdAt: now,
  });
}


/**
 * 获取所有服务器的最新检测数据
 * - 返回每个服务器的最新一条检测记录
 * - 按 updatedAt 降序排列
 * 
 * @returns 服务器列表（带元数据）
 * Requirements: 2.1, 2.3
 */
export async function getAllServers(): Promise<ServerWithMeta[]> {
  // 获取所有服务器，按更新时间降序排列
  const allServers = await db
    .select()
    .from(servers)
    .orderBy(desc(servers.updatedAt));
  
  // 为每个服务器获取最新的检测记录
  const result: ServerWithMeta[] = [];
  
  for (const server of allServers) {
    // 获取该服务器最新的检测记录
    const latestRecord = await db
      .select()
      .from(detectionRecords)
      .where(eq(detectionRecords.serverId, server.id))
      .orderBy(desc(detectionRecords.createdAt))
      .limit(1);
    
    if (latestRecord.length > 0) {
      result.push({
        id: server.id,
        remark: server.remark,
        data: JSON.parse(latestRecord[0].data) as ServerDataOrArray,
        createdAt: server.createdAt.toISOString(),
        updatedAt: server.updatedAt.toISOString(),
      });
    }
  }
  
  return result;
}

/**
 * 根据 ID 获取单个服务器的最新检测数据
 * 
 * @param serverId 服务器唯一标识
 * @returns 服务器数据（带元数据），如果不存在返回 null
 * Requirements: 3.1
 */
export async function getServerById(serverId: string): Promise<ServerWithMeta | null> {
  // 获取服务器基本信息
  const serverResult = await db
    .select()
    .from(servers)
    .where(eq(servers.id, serverId))
    .limit(1);
  
  if (serverResult.length === 0) {
    return null;
  }
  
  const server = serverResult[0];
  
  // 获取最新的检测记录
  const latestRecord = await db
    .select()
    .from(detectionRecords)
    .where(eq(detectionRecords.serverId, serverId))
    .orderBy(desc(detectionRecords.createdAt))
    .limit(1);
  
  if (latestRecord.length === 0) {
    return null;
  }
  
  return {
    id: server.id,
    remark: server.remark,
    data: JSON.parse(latestRecord[0].data) as ServerDataOrArray,
    createdAt: server.createdAt.toISOString(),
    updatedAt: server.updatedAt.toISOString(),
  };
}

/**
 * 更新服务器备注
 * 
 * @param serverId 服务器唯一标识
 * @param remark 备注内容
 * @returns 是否更新成功
 */
export async function updateServerRemark(serverId: string, remark: string | null): Promise<boolean> {
  const result = await db
    .update(servers)
    .set({ remark, updatedAt: new Date() })
    .where(eq(servers.id, serverId));
  
  return (result.rowCount ?? 0) > 0;
}
