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
    echo "🎉 上传成功！"
    echo "   响应: $BODY"
else
    echo "❌ 上传失败 (HTTP $HTTP_CODE)"
    echo "   响应: $BODY"
    exit 1
fi

# 清理临时文件
rm -f "$RESULT_FILE"
`;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'inline; filename="detect-and-upload.sh"',
    },
  });
}
