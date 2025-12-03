"use client"

import { useState, useEffect } from "react"
import { ServerList } from "./server-list"
import { ServerDetail } from "./server-detail"
import { useServers } from "@/hooks/use-servers"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Server, RefreshCw, Menu, ChevronLeft, ChevronRight } from "lucide-react"
import type { ServerWithMeta } from "@/lib/mock-data"

function ServerListSkeleton() {
  return (
    <aside className="hidden md:block w-72 shrink-0 border-r border-border bg-sidebar overflow-y-auto">
      <div className="p-4">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">服务器列表</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full rounded-lg p-3 border border-transparent">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function ServerDetailSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-6 pt-4 pb-3 border-b border-border">
        <Skeleton className="h-4 w-48 mb-3" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-md" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  )
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
          <Server className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">暂无服务器数据</h3>
        <p className="text-sm text-muted-foreground mb-4">还没有服务器提交检测数据</p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          刷新
        </button>
      </div>
    </div>
  )
}

export function DetectionDashboard() {
  const { servers, isLoading, error, refetch } = useServers()
  const { toast } = useToast()
  const [selectedServer, setSelectedServer] = useState<ServerWithMeta | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "获取数据失败",
        description: error.message || "无法加载服务器数据，请稍后重试",
      })
    }
  }, [error, toast])

  // Auto-select first server when data loads
  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      setSelectedServer(servers[0])
    }
  }, [servers, selectedServer])

  const currentIndex = selectedServer ? servers.findIndex(s => s.id === selectedServer.id) : 0
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < servers.length - 1

  const goToPrev = () => {
    if (canGoPrev) setSelectedServer(servers[currentIndex - 1])
  }
  const goToNext = () => {
    if (canGoNext) setSelectedServer(servers[currentIndex + 1])
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="shrink-0 border-b border-border px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            {/* 移动端菜单按钮 */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-1.5 rounded-md hover:bg-muted transition-colors">
                  <Menu className="h-5 w-5 text-muted-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <ServerList
                  servers={servers}
                  selectedServer={selectedServer || servers[0]}
                  onSelectServer={(server) => {
                    setSelectedServer(server)
                    setSheetOpen(false)
                  }}
                  isMobile
                />
              </SheetContent>
            </Sheet>
            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-primary/20">
              <svg className="h-4 w-4 md:h-5 md:w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <h1 className="text-base md:text-xl font-semibold text-foreground">IP 质量检测</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {isLoading ? (
              <Skeleton className="h-4 w-16 md:w-20" />
            ) : (
              <span className="hidden sm:inline text-sm text-muted-foreground">{servers.length} 台服务器</span>
            )}
            <button
              onClick={refetch}
              disabled={isLoading}
              className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
              title="刷新数据"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {isLoading ? (
          <>
            <ServerListSkeleton />
            <main className="flex-1 overflow-hidden">
              <ServerDetailSkeleton />
            </main>
          </>
        ) : servers.length === 0 ? (
          <EmptyState onRefresh={refetch} />
        ) : (
          <>
            {/* 桌面端侧边栏 */}
            <div className="hidden md:flex h-full overflow-hidden">
              <ServerList
                servers={servers}
                selectedServer={selectedServer || servers[0]}
                onSelectServer={setSelectedServer}
              />
            </div>
            <main className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 min-h-0">
                <ServerDetail serverData={(selectedServer || servers[0]).data} />
              </div>
              {/* 移动端底部导航 */}
              <div className="md:hidden shrink-0 border-t border-border bg-background px-4 py-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={goToPrev}
                    disabled={!canGoPrev}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    上一个
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {currentIndex + 1} / {servers.length}
                  </span>
                  <button
                    onClick={goToNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    下一个
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  )
}
