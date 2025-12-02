import { db, schema } from "./db";
import { eq, desc } from "drizzle-orm";
import type { ServerData, ServerWithMeta } from "./mock-data";

const { servers, detectionRecords } = schema;

/**
 * 保存服务器检测数据
 * - 如果服务器不存在，创建新服务器记录
 * - 如果服务器已存在，更新 updatedAt 时间戳
 * - 始终创建新的检测记录（保留历史）
 * 
 * @param serverId 服务器唯一标识
 * @param data 检测数据
 * Requirements: 1.1, 1.4
 */
export function saveServerData(serverId: string, data: ServerData): void {
  const now = new Date().toISOString();
  
  // 检查服务器是否存在
  const existingServer = db
    .select()
    .from(servers)
    .where(eq(servers.id, serverId))
    .get();
  
  if (existingServer) {
    // 更新服务器的 updatedAt 时间戳
    db
      .update(servers)
      .set({ updatedAt: now })
      .where(eq(servers.id, serverId))
      .run();
  } else {
    // 创建新服务器记录
    db.insert(servers).values({
      id: serverId,
      createdAt: now,
      updatedAt: now,
    }).run();
  }
  
  // 创建新的检测记录
  db.insert(detectionRecords).values({
    serverId,
    data: JSON.stringify(data),
    createdAt: now,
  }).run();
}


/**
 * 获取所有服务器的最新检测数据
 * - 返回每个服务器的最新一条检测记录
 * - 按 updatedAt 降序排列
 * 
 * @returns 服务器列表（带元数据）
 * Requirements: 2.1, 2.3
 */
export function getAllServers(): ServerWithMeta[] {
  // 获取所有服务器，按更新时间降序排列
  const allServers = db
    .select()
    .from(servers)
    .orderBy(desc(servers.updatedAt))
    .all();
  
  // 为每个服务器获取最新的检测记录
  const result: ServerWithMeta[] = [];
  
  for (const server of allServers) {
    // 获取该服务器最新的检测记录
    const latestRecord = db
      .select()
      .from(detectionRecords)
      .where(eq(detectionRecords.serverId, server.id))
      .orderBy(desc(detectionRecords.createdAt))
      .limit(1)
      .get();
    
    if (latestRecord) {
      result.push({
        id: server.id,
        data: JSON.parse(latestRecord.data) as ServerData,
        createdAt: server.createdAt,
        updatedAt: server.updatedAt,
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
export function getServerById(serverId: string): ServerWithMeta | null {
  // 获取服务器基本信息
  const server = db
    .select()
    .from(servers)
    .where(eq(servers.id, serverId))
    .get();
  
  if (!server) {
    return null;
  }
  
  // 获取最新的检测记录
  const latestRecord = db
    .select()
    .from(detectionRecords)
    .where(eq(detectionRecords.serverId, serverId))
    .orderBy(desc(detectionRecords.createdAt))
    .limit(1)
    .get();
  
  if (!latestRecord) {
    return null;
  }
  
  return {
    id: server.id,
    data: JSON.parse(latestRecord.data) as ServerData,
    createdAt: server.createdAt,
    updatedAt: server.updatedAt,
  };
}
