import { NextRequest, NextResponse } from "next/server";
import { parseGoecsResult } from "@/lib/platform-unlock-parser";
import {
  savePlatformUnlock,
  getLatestPlatformUnlock,
  getPlatformUnlockHistory,
} from "@/lib/platform-unlock-repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/servers/[id]/platform-unlock
 * 获取服务器的平台解锁数据
 * ?history=true 获取历史记录
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: serverId } = await params;
    const { searchParams } = new URL(request.url);
    const history = searchParams.get("history") === "true";

    if (history) {
      const records = await getPlatformUnlockHistory(serverId);
      return NextResponse.json({ success: true, data: records });
    }

    const record = await getLatestPlatformUnlock(serverId);
    if (!record) {
      return NextResponse.json(
        { success: false, error: "No platform unlock data found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Failed to get platform unlock data:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/servers/[id]/platform-unlock
 * 上传平台解锁检测结果
 * Body: { content: string } - goecs 测试结果文本
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: serverId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid content" },
        { status: 400 }
      );
    }

    // 解析内容
    const data = parseGoecsResult(content);

    if (data.platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: "No platform data found in content" },
        { status: 400 }
      );
    }

    // 保存数据
    await savePlatformUnlock(serverId, data, content);

    return NextResponse.json({
      success: true,
      message: "Platform unlock data saved",
      platformCount: data.platforms.length,
    });
  } catch (error) {
    console.error("Failed to save platform unlock data:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
