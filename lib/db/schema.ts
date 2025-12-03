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
