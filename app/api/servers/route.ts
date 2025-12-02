import { NextRequest, NextResponse } from "next/server";
import { validateSubmitRequest } from "@/lib/validation";
import { saveServerData, getAllServers } from "@/lib/server-repository";
import type { SubmitSuccessResponse, ErrorResponse, ServerWithMeta } from "@/lib/mock-data";

/**
 * 验证 Authorization Header
 * 格式: Bearer <token>
 */
function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  const expectedToken = process.env.API_AUTH_TOKEN;
  
  // 如果未配置 token，跳过鉴权（开发环境）
  if (!expectedToken) {
    return true;
  }
  
  if (!authHeader) {
    return false;
  }
  
  // 支持 "Bearer <token>" 格式
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  
  return token === expectedToken;
}

/**
 * POST /api/servers
 * 提交服务器检测数据
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export async function POST(request: NextRequest): Promise<NextResponse<SubmitSuccessResponse | ErrorResponse>> {
  try {
    // 验证鉴权
    if (!validateAuth(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 解析请求体
    const body = await request.json();
    
    // 验证请求数据
    const validation = validateSubmitRequest(body);
    
    if (!validation.success) {
      // 检查是否缺少 serverId
      const missingServerId = validation.errors?.some(
        (err) => err.includes("serverId")
      );
      
      if (missingServerId) {
        // Requirements 1.2: 缺少 serverId 返回 400
        return NextResponse.json(
          { error: "缺少服务器ID" },
          { status: 400 }
        );
      }
      
      // Requirements 1.3: 数据验证失败返回 400，包含详细错误信息
      return NextResponse.json(
        { 
          error: "数据验证失败", 
          details: validation.errors
        },
        { status: 400 }
      );
    }
    
    // Requirements 1.1, 1.4: 保存数据到数据库
    const { serverId, data } = validation.data!;
    await saveServerData(serverId, data);
    
    // 返回成功响应
    return NextResponse.json(
      { success: true as const, id: serverId },
      { status: 201 }
    );
  } catch (error) {
    // 处理 JSON 解析错误
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "JSON 格式无效" },
        { status: 400 }
      );
    }
    
    // 数据库或其他内部错误
    console.error("POST /api/servers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


/**
 * GET /api/servers
 * 获取所有服务器的最新检测数据列表
 * 
 * Requirements: 2.1, 2.2, 2.3
 */
export async function GET(): Promise<NextResponse<ServerWithMeta[]>> {
  try {
    // Requirements 2.1, 2.3: 获取所有服务器，按更新时间降序排列
    const servers = await getAllServers();
    
    // Requirements 2.2: 空数据库返回空数组
    return NextResponse.json(servers);
  } catch (error) {
    console.error("GET /api/servers error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
