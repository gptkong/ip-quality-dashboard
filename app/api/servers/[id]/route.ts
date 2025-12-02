import { NextRequest, NextResponse } from "next/server";
import { getServerById } from "@/lib/server-repository";
import type { ServerWithMeta, ErrorResponse } from "@/lib/mock-data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/servers/[id]
 * 获取单个服务器的详细检测数据
 * 
 * Requirements: 3.1, 3.2
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ServerWithMeta | ErrorResponse>> {
  try {
    const { id } = await params;
    
    // Requirements 3.1: 获取服务器数据
    const server = await getServerById(id);
    
    if (!server) {
      // Requirements 3.2: 服务器不存在返回 404
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(server);
  } catch (error) {
    console.error(`GET /api/servers/[id] error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
