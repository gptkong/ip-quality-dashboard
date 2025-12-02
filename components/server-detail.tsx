"use client"

import { useRef, useState, useEffect } from "react"
import type { ServerData, ServerDataOrArray } from "@/lib/mock-data"
import { InfoCard } from "./cards/info-card"
import { TypeCard } from "./cards/type-card"
import { ScoreCard } from "./cards/score-card"
import { FactorCard } from "./cards/factor-card"
import { MediaCard } from "./cards/media-card"
import { MailCard } from "./cards/mail-card"
import { Clock, Globe2, Server, ShieldCheck, Fingerprint, Play, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ServerDetailProps {
  serverData: ServerDataOrArray
}

// 标准化为数组
function normalizeToArray(data: ServerDataOrArray): ServerData[] {
  if (Array.isArray(data) && data.length > 0 && 'Head' in data[0]) {
    return data as ServerData[]
  }
  return [data as ServerData]
}

// 判断是否为 IPv6
function isIPv6(ip: string): boolean {
  return ip.includes(':')
}

const sectionTabs = [
  { id: "info", label: "基础信息", icon: Globe2 },
  { id: "type", label: "IP类型", icon: Server },
  { id: "score", label: "风险评分", icon: ShieldCheck },
  { id: "factor", label: "风险因子", icon: Fingerprint },
  { id: "media", label: "流媒体", icon: Play },
  { id: "mail", label: "邮局连通", icon: Mail },
]

export function ServerDetail({ serverData }: ServerDetailProps) {
  const dataArray = normalizeToArray(serverData)
  const isDualStack = dataArray.length > 1
  
  const [activeIpIndex, setActiveIpIndex] = useState(0)
  const server = dataArray[activeIpIndex]
  const head = server.Head[0]
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [activeTab, setActiveTab] = useState("info")
  
  // 当服务器数据变化时重置 IP 索引
  useEffect(() => {
    setActiveIpIndex(0)
  }, [serverData])

  const scrollToSection = (id: string) => {
    const section = sectionRefs.current[id]
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // 监听滚动，更新当前激活的 tab
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      let currentSection = "info"
      
      for (const tab of sectionTabs) {
        const section = sectionRefs.current[tab.id]
        if (section) {
          const offsetTop = section.offsetTop - container.offsetTop
          if (scrollTop >= offsetTop - 100) {
            currentSection = tab.id
          }
        }
      }
      setActiveTab(currentSection)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [activeIpIndex])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Info */}
      <div className="shrink-0 px-4 md:px-6 pt-3 md:pt-4 pb-3 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        {/* IPv4/IPv6 切换 tabs（双栈时显示） */}
        {isDualStack && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">IP 版本:</span>
            {dataArray.map((data, index) => {
              const ip = data.Head[0].IP
              const version = isIPv6(ip) ? 'IPv6' : 'IPv4'
              return (
                <button
                  key={ip}
                  onClick={() => setActiveIpIndex(index)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                    activeIpIndex === index
                      ? version === 'IPv6'
                        ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                        : "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {version}
                </button>
              )
            })}
            <span className="ml-2 font-mono text-xs text-muted-foreground truncate">
              {head.IP}
            </span>
          </div>
        )}
        
        <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs">{head.Time}</span>
        </div>

        {/* Section Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
          {sectionTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" ref={scrollContainerRef}>
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <section ref={(el) => { sectionRefs.current["info"] = el }} className="scroll-mt-4">
            <InfoCard info={server.Info[0]} />
          </section>

          <section ref={(el) => { sectionRefs.current["type"] = el }} className="scroll-mt-4">
            <TypeCard type={server.Type[0]} />
          </section>

          <section ref={(el) => { sectionRefs.current["score"] = el }} className="scroll-mt-4">
            <ScoreCard score={server.Score[0]} />
          </section>

          <section ref={(el) => { sectionRefs.current["factor"] = el }} className="scroll-mt-4">
            <FactorCard factor={server.Factor[0]} />
          </section>

          <section ref={(el) => { sectionRefs.current["media"] = el }} className="scroll-mt-4">
            <MediaCard media={server.Media[0]} />
          </section>

          <section ref={(el) => { sectionRefs.current["mail"] = el }} className="scroll-mt-4">
            <MailCard mail={server.Mail[0]} />
          </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
