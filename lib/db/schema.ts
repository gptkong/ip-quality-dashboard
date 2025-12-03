import { pgTable, text, serial, timestamp, index } from "drizzle-orm/pg-core";

// 服务器表：存储服务器基本信息
export const servers = pgTable("servers", {
  id: text("id").primaryKey(),
  remark: text("remark"), // 服务器备注名称
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// 检测记录表：存储每次检测的完整数据
export const detectionRecords = pgTable(
  "detection_records",
  {
    id: serial("id").primaryKey(),
    serverId: text("server_id")
      .notNull()
      .references(() => servers.id),
    data: text("data").notNull(), // JSON 格式存储 ServerData
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_detection_records_server_id").on(table.serverId),
    index("idx_detection_records_created_at").on(table.createdAt),
  ]
);

// 平台解锁记录表：存储跨国平台解锁检测结果
export const platformUnlocks = pgTable(
  "platform_unlocks",
  {
    id: serial("id").primaryKey(),
    serverId: text("server_id")
      .notNull()
      .references(() => servers.id),
    ipv4Asn: text("ipv4_asn"),           // ASN 信息
    ipv4Location: text("ipv4_location"), // 地理位置
    platforms: text("platforms").notNull(), // JSON 格式存储平台解锁状态
    rawContent: text("raw_content"),     // 原始文本内容
    testTime: timestamp("test_time", { withTimezone: true }), // 测试时间
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_platform_unlocks_server_id").on(table.serverId),
    index("idx_platform_unlocks_created_at").on(table.createdAt),
  ]
);
