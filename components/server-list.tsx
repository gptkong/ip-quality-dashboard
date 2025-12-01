"use client"

import { cn } from "@/lib/utils"
import type { ServerData } from "@/lib/mock-data"
import { Server, Globe, MapPin } from "lucide-react"

interface ServerListProps {
  servers: ServerData[]
  selectedServer: ServerData
  onSelectServer: (server: ServerData) => void
}

export function ServerList({ servers, selectedServer, onSelectServer }: ServerListProps) {
  return (
    <aside className="w-72 shrink-0 border-r border-border bg-sidebar overflow-y-auto">
      <div className="p-4">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">服务器列表</h2>
        <div className="space-y-2">
          {servers.map((server) => {
            const isSelected = server.Head[0].IP === selectedServer.Head[0].IP
            return (
              <button
                key={server.Head[0].IP}
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
                    <p className="font-mono text-sm font-medium text-foreground truncate">{server.Head[0].IP}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{server.Info[0].Organization}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {server.Info[0].City.Name}, {server.Info[0].Region.Name}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
