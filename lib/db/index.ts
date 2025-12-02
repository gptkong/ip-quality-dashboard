import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { existsSync, mkdirSync, readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";

const DB_PATH = "./data/ip-quality.db";
const MIGRATIONS_DIR = "./drizzle";

// 确保数据目录存在
const dataDir = dirname(DB_PATH);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// 检查数据库是否是新创建的
const isNewDatabase = !existsSync(DB_PATH);

// 创建数据库连接
const sqlite = new Database(DB_PATH);

// 启用外键约束
sqlite.pragma("foreign_keys = ON");

// 如果是新数据库，自动执行迁移创建表结构
// Requirements: 5.1, 5.2
if (isNewDatabase) {
  initializeTables(sqlite);
}

/**
 * 初始化数据库表结构
 * 读取 drizzle 目录下的迁移文件并执行
 */
function initializeTables(db: Database.Database): void {
  if (!existsSync(MIGRATIONS_DIR)) {
    console.warn("⚠️ 未找到迁移目录，请先运行 pnpm db:generate");
    return;
  }

  try {
    const files = readdirSync(MIGRATIONS_DIR);
    const sqlFiles = files.filter((f: string) => f.endsWith(".sql")).sort();

    if (sqlFiles.length === 0) {
      console.warn("⚠️ 未找到迁移文件，请先运行 pnpm db:generate");
      return;
    }

    console.log("🚀 初始化数据库表结构...");

    for (const file of sqlFiles) {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
      const statements = sql
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        db.exec(statement);
      }
    }

    console.log("✅ 数据库表结构创建成功！");
  } catch (error) {
    console.error("❌ 数据库初始化失败:", error);
    throw error;
  }
}

export const db = drizzle(sqlite, { schema });

// 导出 schema 以便其他模块使用
export { schema };
