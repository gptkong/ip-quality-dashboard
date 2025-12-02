/**
 * 数据库初始化脚本
 * 用于在 Vercel Postgres 上创建表结构
 * 
 * 使用方式: 
 *   POSTGRES_URL=xxx pnpm db:push
 * 
 * 或者使用 Drizzle Studio 查看数据:
 *   POSTGRES_URL=xxx pnpm db:studio
 */

console.log("🚀 PostgreSQL 数据库初始化\n");
console.log("请使用以下命令管理数据库:\n");
console.log("  pnpm db:generate  - 生成迁移文件");
console.log("  pnpm db:push      - 推送 schema 到数据库（开发用）");
console.log("  pnpm db:migrate   - 执行迁移（生产用）");
console.log("  pnpm db:studio    - 打开 Drizzle Studio 查看数据\n");
console.log("⚠️  确保设置了 POSTGRES_URL 环境变量");
