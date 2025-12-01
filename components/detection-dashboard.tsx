"use client"

import { useState } from "react"
import { ServerList } from "./server-list"
import { ServerDetail } from "./server-detail"
import { mockServers } from "@/lib/mock-data"

export function DetectionDashboard() {
  const [selectedServer, setSelectedServer] = useState(mockServers[0])

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="shrink-0 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-foreground">IP 质量检测</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{mockServers.length} 台服务器</span>
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ServerList servers={mockServers} selectedServer={selectedServer} onSelectServer={setSelectedServer} />
        <main className="flex-1 overflow-y-auto">
          <ServerDetail server={selectedServer} />
        </main>
      </div>
    </div>
  )
}
