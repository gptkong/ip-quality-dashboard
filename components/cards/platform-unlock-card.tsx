"use client";

import { Check, X, Ban, HelpCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlatformStatus } from "@/lib/platform-unlock-parser";

interface PlatformUnlockCardProps {
  platforms: PlatformStatus[];
  ipv4Asn?: string | null;
  ipv4Location?: string | null;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "YES":
      return {
        bg: "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10",
        icon: <Check className="h-3.5 w-3.5 text-emerald-500" />,
        badge: "bg-emerald-500/15 text-emerald-500",
        label: "解锁",
      };
    case "NO":
      return {
        bg: "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10",
        icon: <X className="h-3.5 w-3.5 text-rose-500" />,
        badge: "bg-rose-500/15 text-rose-500",
        label: "未解锁",
      };
    case "Banned":
      return {
        bg: "bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10",
        icon: <Ban className="h-3.5 w-3.5 text-orange-500" />,
        badge: "bg-orange-500/15 text-orange-500",
        label: "封禁",
      };
    default:
      return {
        bg: "bg-muted/30 border-border hover:bg-muted/50",
        icon: <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />,
        badge: "bg-muted text-muted-foreground",
        label: "未知",
      };
  }
};

export function PlatformUnlockCard({
  platforms,
  ipv4Asn,
  ipv4Location,
}: PlatformUnlockCardProps) {
  // 统计
  const stats = {
    total: platforms.length,
    unlocked: platforms.filter((p) => p.status === "YES").length,
    blocked: platforms.filter((p) => p.status === "NO").length,
    banned: platforms.filter((p) => p.status === "Banned").length,
  };

  return (
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5">
      {/* IP 信息头部 */}
      {(ipv4Asn || ipv4Location) && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            {ipv4Location && <span>{ipv4Location}</span>}
            {ipv4Asn && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                {ipv4Asn}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 统计概览 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">共</span>
          <span className="font-medium">{stats.total}</span>
          <span className="text-muted-foreground">项</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500">
          <Check className="h-3 w-3" />
          <span>{stats.unlocked} 解锁</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-rose-500">
          <X className="h-3 w-3" />
          <span>{stats.blocked} 未解锁</span>
        </div>
        {stats.banned > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-orange-500">
            <Ban className="h-3 w-3" />
            <span>{stats.banned} 封禁</span>
          </div>
        )}
      </div>

      {/* 平台列表 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {platforms.map((platform, index) => {
          const config = getStatusConfig(platform.status);
          return (
            <div
              key={`${platform.name}-${index}`}
              className={cn(
                "group relative flex flex-col gap-1 rounded-lg border p-2.5 transition-all hover:scale-[1.02]",
                config.bg
              )}
            >
              {/* 平台名称 */}
              <p className="text-xs font-medium truncate text-foreground/90">
                {platform.name}
              </p>

              {/* 状态和区域 */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
                    config.badge
                  )}
                >
                  {config.icon}
                  {config.label}
                </span>
                {platform.region && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 truncate max-w-[60px]">
                    {platform.region}
                  </span>
                )}
                {platform.type && (
                  <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                    platform.type.toLowerCase().includes('dns')
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    {platform.type.toLowerCase().includes('dns') ? 'DNS' : '原生'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
