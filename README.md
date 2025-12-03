# 🖥️ IP 质量检测面板

一个用于展示服务器 IP 质量检测结果的 Dashboard，支持 IP 质量评分、流媒体解锁检测、网络类型识别等多维度数据展示。

## ✨ 功能特性

- 📊 **IP 质量评分** - 综合评估 IP 地址质量
- 🎬 **流媒体解锁检测** - Netflix、Disney+、YouTube Premium 等平台解锁状态
- 🌍 **跨国平台解锁** - 多地区流媒体平台解锁检测（基于 goecs）
- 🔍 **网络类型识别** - 识别原生 IP、广播 IP、商业宽带等类型
- 📧 **邮件端口检测** - SMTP 端口可用性检测
- 🏷️ **服务器备注** - 自定义服务器名称便于管理
- 🌙 **深色模式** - 支持亮色/深色主题切换
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 🚀 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgptkong%2Fip-quality-dashboard&env=API_AUTH_TOKEN,ADMIN_PASSWORD&envDescription=API_AUTH_TOKEN%20用于保护数据上传接口%EF%BC%8CADMIN_PASSWORD%20用于管理后台登录&envLink=https%3A%2F%2Fgithub.com%2Fgptkong%2Fip-quality-dashboard%23环境变量&stores=[{"type":"postgres"}])

### 部署步骤

1. 点击上方 "Deploy with Vercel" 按钮
2. 授权 Vercel 访问你的 GitHub
3. 填写环境变量（见下方说明）
4. 等待部署完成
5. 运行检测脚本上传数据

## 📋 环境变量

| 变量名 | 必填 | 说明 |
|--------|:----:|------|
| `POSTGRES_URL` | ✅ | Vercel Postgres 连接字符串（关联 Storage 后自动添加） |
| `API_AUTH_TOKEN` | ✅ | API 鉴权 Token，用于保护数据上传接口 |
| `ADMIN_PASSWORD` | ✅ | 管理后台登录密码 |

## 📡 数据上传

部署完成后，在你的服务器上运行以下命令进行检测并上传数据：

```bash
# 一键检测并上传（替换 YOUR_DOMAIN 和 YOUR_TOKEN）
curl -fsSL "https://YOUR_DOMAIN/api/script?token=YOUR_TOKEN" | bash
```

该脚本会自动：
1. 运行 IP 质量检测（IP.Check.Place）
2. 运行跨国平台解锁检测（goecs）
3. 将结果上传到你的面板

### 定时检测

使用 crontab 设置定时任务：

```bash
# 每天凌晨 3 点执行检测
0 3 * * * curl -fsSL "https://YOUR_DOMAIN/api/script?token=YOUR_TOKEN" | bash
```

## 🔌 API 接口

### 服务器数据

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/servers` | 获取所有服务器列表 |
| `POST` | `/api/servers` | 上传检测数据（需鉴权） |
| `GET` | `/api/servers/[id]` | 获取单个服务器详情 |
| `PATCH` | `/api/servers/[id]/remark` | 更新服务器备注 |
| `POST` | `/api/servers/[id]/platform-unlock` | 上传平台解锁数据（需鉴权） |

### 工具接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/script?token=xxx` | 获取检测脚本 |

### 管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/admin/auth` | 管理员登录 |
| `GET` | `/api/admin/auth` | 检查登录状态 |
| `DELETE` | `/api/admin/auth` | 退出登录 |

### 请求示例

```bash
# 上传检测数据
curl -X POST "https://YOUR_DOMAIN/api/servers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"serverId": "server-001", "data": [...]}'
```

## 💻 本地开发

```bash
# 克隆项目
git clone https://github.com/gptkong/ip-quality-dashboard.git
cd ip-quality-dashboard

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env

# 编辑 .env 填入配置
# POSTGRES_URL=postgres://...
# API_AUTH_TOKEN=your-token
# ADMIN_PASSWORD=your-password

# 推送数据库结构
pnpm db:push

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看面板。

## 🛠️ 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm db:push      # 推送 schema 到数据库
pnpm db:studio    # 打开 Drizzle Studio 查看数据
pnpm db:generate  # 生成迁移文件
pnpm db:migrate   # 执行数据库迁移
```

## 🗄️ 数据库结构

项目使用 Drizzle ORM + Vercel Postgres：

- `servers` - 服务器基本信息（ID、备注、时间戳）
- `detection_records` - IP 质量检测记录
- `platform_unlocks` - 跨国平台解锁检测记录

## 🔧 技术栈

- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS 4
- **组件**: shadcn/ui
- **数据库**: Vercel Postgres
- **ORM**: Drizzle ORM
- **部署**: Vercel

## 📖 详细部署指南

查看 [DEPLOY.md](./DEPLOY.md) 获取完整的手动部署说明。

## 🙏 致谢

本项目的检测功能基于以下优秀的开源项目：

- [IPQuality](https://github.com/xykt/IPQuality) - IP 质量检测脚本
- [ecs](https://github.com/oneclickvirt/ecs) - 跨国平台解锁检测工具 (goecs)

感谢这些项目的作者和贡献者！

## 📄 License

MIT
