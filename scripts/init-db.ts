/**
 * 数据库初始化脚本
 * 用于首次运行时自动创建 SQLite 数据库文件和必要的表结构
 * 
 * 使用方式: pnpm db:init
 * 
 * Requirements: 5.1, 5.2
 * 
 * 注意: 此脚本在应用启动时由 lib/db/index.ts 自动调用
 * 也可以通过 pnpm db:init 手动运行
 */

import { existsSync, mkdirSync, readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";

const DB_PATH = "./data/ip-quality.db";
const MIGRATIONS_DIR = "./drizzle";

export function getMigrationSQL(): string[] {
  if (!existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  const files = readdirSync(MIGRATIONS_DIR) as string[];
  const sqlFiles = files.filter((f: string) => f.endsWith(".sql")).sort();
  
  const statements: string[] = [];
  
  for (const file of sqlFiles) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    const fileStatements = sql
      .split("--> statement-breakpoint")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    statements.push(...fileStatements);
  }
  
  return statements;
}

export function ensureDataDirectory(): void {
  const dataDir = dirname(DB_PATH);
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
    console.log(`✅ 创建数据目录: ${dataDir}`);
  }
}

export function isDatabaseExists(): boolean {
  return existsSync(DB_PATH);
}

// 当直接运行此脚本时，显示帮助信息
if (require.main === module) {
  console.log("🚀 数据库初始化脚本\n");
  
  ensureDataDirectory();
  
  if (isDatabaseExists()) {
    console.log(`ℹ️  数据库文件已存在: ${DB_PATH}`);
    console.log("   将复用现有数据库。\n");
  } else {
    console.log(`📦 数据库文件将在首次访问时创建: ${DB_PATH}`);
  }
  
  const migrations = getMigrationSQL();
  if (migrations.length === 0) {
    console.log("⚠️  未找到迁移文件，请先运行 pnpm db:generate");
  } else {
    console.log(`\n�  找到 ${migrations.length} 条 SQL 语句待执行`);
    console.log("\n💡 提示: 数据库表结构将在应用首次启动时自动创建");
    console.log("   或者运行 pnpm dev 启动开发服务器");
  }
  
  console.log("\n🎉 初始化检查完成！");
}
