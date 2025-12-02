"use client"

import { cn } from "@/lib/utils"
import type { ServerData, ServerDataOrArray, ServerWithMeta } from "@/lib/mock-data"
import { Server, Globe, MapPin } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ServerListProps {
  servers: ServerWithMeta[]
  selectedServer: ServerWithMeta
  onSelectServer: (server: ServerWithMeta) => void
  isMobile?: boolean
}

// 获取第一个 IP 数据（用于显示）
function getFirstData(data: ServerDataOrArray): ServerData {
  if (Array.isArray(data) && data.length > 0 && 'Head' in data[0]) {
    return data[0] as ServerData
  }
  return data as ServerData
}

// 判断是否为双栈
function isDualStack(data: ServerDataOrArray): boolean {
  return Array.isArray(data) && data.length > 1 && 'Head' in data[0]
}

export function ServerList({ servers, selectedServer, onSelectServer, isMobile }: ServerListProps) {
  return (
    <aside className={cn(
      "shrink-0 bg-sidebar",
      isMobile ? "w-full h-full" : "w-72 border-r border-border"
    )}>
      <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">服务器列表</h2>
        <div className="space-y-2">
          {servers.map((server) => {
            const firstData = getFirstData(server.data)
            const ip = firstData.Head[0].IP
            const isSelected = server.id === selectedServer.id
            const hasDualStack = isDualStack(server.data)
            return (
              <button
                key={server.id}
                onClick={() => onSelectServer(server)}
                className={cn(
                  "w-full rounded-lg p-3 text-left transition-all",
                  isSelected
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-secondary border border-transparent",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 items-center justify-center rounded-md",
                      isSelected ? "bg-primary/20" : "bg-muted",
                    )}
                  >
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-mono text-sm font-medium text-foreground truncate">{ip}</p>
                      {hasDualStack && (
                        <span className="shrink-0 px-1 py-0.5 text-[10px] font-medium rounded bg-purple-500/20 text-purple-400">
                          双栈
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{firstData.Info[0].Organization}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {firstData.Info[0].City.Name}, {firstData.Info[0].Region.Name}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      </ScrollArea>
    </aside>
  )
}
