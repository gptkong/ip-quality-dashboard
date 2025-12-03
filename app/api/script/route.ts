import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || 'YOUR_TOKEN_HERE';
  
  // 自动获取当前服务器的 host 地址
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const apiUrl = `${protocol}://${host}/api/servers`;

  const script = `#!/bin/bash

# IP 质量检测并上传脚本
# 自动生成于: ${new Date().toISOString()}
# 用法: curl -fsSL "${protocol}://${host}/api/script?token=YOUR_TOKEN" | bash

# 配置（已自动填入）
API_URL="${apiUrl}"
AUTH_TOKEN="${token}"

# ID 持久化文件路径
ID_FILE="\${HOME}/.ip-quality-server-id"

# 读取或生成服务器 ID
if [ -f "$ID_FILE" ]; then
    SERVER_ID=$(cat "$ID_FILE")
    echo "📌 读取已有服务器 ID: $SERVER_ID"
else
    # 使用主机名 + 主 IP 的 hash 作为唯一 ID
    HOSTNAME=$(hostname)
    PRIMARY_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || ip route get 1 2>/dev/null | awk '{print $7}' | head -1)
    SERVER_ID=$(echo "\${HOSTNAME}-\${PRIMARY_IP}" | md5sum | cut -c1-12)
    
    # 持久化 ID
    echo "$SERVER_ID" > "$ID_FILE"
    echo "📌 生成并保存服务器 ID: $SERVER_ID"
    echo "   存储位置: $ID_FILE"
fi

RESULT_FILE="/tmp/ip-quality-result-\${SERVER_ID}.json"
GOECS_RESULT_FILE="/tmp/goecs-result-\${SERVER_ID}.txt"

echo "🔍 开始 IP 质量检测..."
echo "   服务器 ID: $SERVER_ID"
echo "   API 地址: $API_URL"

# 运行检测脚本（-y 自动安装依赖）
bash <(curl -Ls https://IP.Check.Place) -y -o "$RESULT_FILE"

# 检查结果文件
if [ ! -f "$RESULT_FILE" ]; then
    echo "❌ 检测失败：未生成结果文件"
    exit 1
fi

echo "✅ 检测完成，准备上传..."

# 解析结果文件（支持双栈：多个 JSON 对象拼接）
JSON_ARRAY=$(jq -s '.' "$RESULT_FILE")
JSON_COUNT=$(echo "$JSON_ARRAY" | jq 'length')

echo "   检测到 $JSON_COUNT 个 IP 结果（IPv4/IPv6）"

# 构建请求 payload
PAYLOAD=$(echo "$JSON_ARRAY" | jq --arg id "$SERVER_ID" '{serverId: $id, data: .}')

# 发送到 API
RESPONSE=$(curl -s -w "\\n%{http_code}" -X POST "$API_URL" \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer $AUTH_TOKEN" \\
    -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '\$d')

if [ "$HTTP_CODE" = "201" ]; then
    echo "🎉 IP 质量检测上传成功！"
    echo "   响应: $BODY"
else
    echo "❌ IP 质量检测上传失败 (HTTP $HTTP_CODE)"
    echo "   响应: $BODY"
fi

# 清理临时文件
rm -f "$RESULT_FILE"

# ========== 跨国平台解锁检测 ==========
echo ""
echo "🌍 开始跨国平台解锁检测..."

# 安装并运行 goecs
export noninteractive=true
curl -L https://raw.githubusercontent.com/oneclickvirt/ecs/master/goecs.sh -o /tmp/goecs.sh
chmod +x /tmp/goecs.sh
/tmp/goecs.sh install

# 运行 goecs 测试（仅跨国平台解锁）
goecs -basic=false -cpu=false -disk=false -email=false -memory=false -nt3=false -ping=false -security=false -speed=false -tgdc=false -web=false -backtrace=false -menu=false -ut=true > "$GOECS_RESULT_FILE" 2>&1

# 检查 goecs 结果
if [ ! -f "$GOECS_RESULT_FILE" ] || [ ! -s "$GOECS_RESULT_FILE" ]; then
    echo "❌ goecs 检测失败：未生成结果文件"
else
    echo "✅ goecs 检测完成，准备上传..."
    
    # 读取结果内容
    GOECS_CONTENT=$(cat "$GOECS_RESULT_FILE")
    
    # 构建 JSON payload
    GOECS_PAYLOAD=$(jq -n --arg content "$GOECS_CONTENT" '{content: $content}')
    
    # 上传到平台解锁 API
    PLATFORM_API_URL="${apiUrl}/\${SERVER_ID}/platform-unlock"
    GOECS_RESPONSE=$(curl -s -w "\\n%{http_code}" -X POST "$PLATFORM_API_URL" \\
        -H "Content-Type: application/json" \\
        -H "Authorization: Bearer $AUTH_TOKEN" \\
        -d "$GOECS_PAYLOAD")
    
    GOECS_HTTP_CODE=$(echo "$GOECS_RESPONSE" | tail -1)
    GOECS_BODY=$(echo "$GOECS_RESPONSE" | sed '\$d')
    
    if [ "$GOECS_HTTP_CODE" = "200" ]; then
        echo "🎉 跨国平台解锁数据上传成功！"
        echo "   响应: $GOECS_BODY"
        # 上传成功后清理临时文件
        rm -f "$GOECS_RESULT_FILE" /tmp/goecs.sh
    else
        echo "❌ 跨国平台解锁数据上传失败 (HTTP $GOECS_HTTP_CODE)"
        echo "   响应: $GOECS_BODY"
        echo "   临时文件保留在: $GOECS_RESULT_FILE"
    fi
fi

echo ""
echo "✨ 所有检测任务完成！"
`;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'inline; filename="detect-and-upload.sh"',
    },
  });
}
