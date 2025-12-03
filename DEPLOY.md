# Vercel 部署指南

## 前置条件

- GitHub 账号
- Vercel 账号（可用 GitHub 登录）

## 部署步骤

### 1. 创建 Vercel Postgres 数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Storage" -> "Create Database"
3. 选择 "Postgres" -> "Continue"
4. 选择区域（建议选择离用户近的区域）
5. 创建完成后，复制 `POSTGRES_URL` 连接字符串

### 2. 导入项目

1. 在 Vercel Dashboard 点击 "Add New..." -> "Project"
2. 导入你的 GitHub 仓库
3. Framework Preset 选择 `Next.js`

### 3. 配置环境变量

在项目设置中添加以下环境变量：

| 变量名 | 说明 |
|--------|------|
| `POSTGRES_URL` | Vercel Postgres 连接字符串（如果关联了 Storage 会自动添加） |
| `API_AUTH_TOKEN` | API 鉴权 Token，用于保护数据上传接口 |

### 4. 初始化数据库表结构

在本地执行（需要先设置环境变量）：

```bash
# Windows PowerShell
$env:POSTGRES_URL="your-postgres-url"
pnpm db:push

# Linux/Mac
POSTGRES_URL="your-postgres-url" pnpm db:push
```

或者在 Vercel 部署后，使用 Vercel CLI：

```bash
vercel env pull .env.local
pnpm db:push
```

### 5. 部署

点击 "Deploy" 按钮，等待部署完成。

---

## 数据上传

部署完成后，使用以下方式上传检测数据：

```bash
# 修改 scripts/detect-and-upload.sh 中的配置
API_URL="https://your-app.vercel.app/api/servers"
API_TOKEN="your-api-token"

# 运行检测脚本
./scripts/detect-and-upload.sh
```

---

## 本地开发

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填入你的数据库连接字符串
# POSTGRES_URL=postgres://...

# 推送表结构到数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

---

## 常用命令

```bash
pnpm db:generate  # 生成迁移文件
pnpm db:push      # 推送 schema 到数据库（开发用）
pnpm db:migrate   # 执行迁移（生产用）
pnpm db:studio    # 打开 Drizzle Studio 查看数据
```

---

## 常见问题

**Q: 部署后 API 返回 500 错误？**

A: 检查 Vercel 日志，确认：
- `POSTGRES_URL` 环境变量已正确设置
- 数据库表结构已创建（运行 `pnpm db:push`）

**Q: 如何查看生产数据库？**

A: 
```bash
vercel env pull .env.local
pnpm db:studio
```

**Q: 连接数据库超时？**

A: Vercel Postgres 有连接池限制，确保代码中没有未关闭的连接。
