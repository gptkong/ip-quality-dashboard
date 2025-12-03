import { NextRequest, NextResponse } from "next/server";
import { updateServerRemark, getServerById } from "@/lib/server-repository";

// PATCH /api/servers/[id]/remark - 更新服务器备注
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { remark } = body;

    // 验证备注长度
    if (remark && typeof remark === "string" && remark.length > 100) {
      return NextResponse.json(
        { error: "备注长度不能超过100个字符" },
        { status: 400 }
      );
    }

    // 检查服务器是否存在
    const server = await getServerById(id);
    if (!server) {
      return NextResponse.json(
        { error: "服务器不存在" },
        { status: 404 }
      );
    }

    // 更新备注
    const success = await updateServerRemark(id, remark || null);
    
    if (success) {
      return NextResponse.json({ success: true, remark: remark || null });
    } else {
      return NextResponse.json(
        { error: "更新失败" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Update remark error:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
