import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// 服务器表：存储服务器基本信息
export const servers = sqliteTable("servers", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 检测记录表：存储每次检测的完整数据
export const detectionRecords = sqliteTable(
  "detection_records",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    serverId: text("server_id")
      .notNull()
      .references(() => servers.id),
    data: text("data").notNull(), // JSON 格式存储 ServerData
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("idx_detection_records_server_id").on(table.serverId),
    index("idx_detection_records_created_at").on(table.createdAt),
  ]
);
