"use client"

import { useRef, useState, useEffect } from "react"
import type { ServerData, ServerDataOrArray } from "@/lib/mock-data"
import { InfoCard } from "./cards/info-card"
import { TypeCard } from "./cards/type-card"
import { ScoreCard } from "./cards/score-card"
import { FactorCard } from "./cards/factor-card"
import { MediaCard } from "./cards/media-card"
import { MailCard } from "./cards/mail-card"
import { Clock, Globe2, Server, ShieldCheck, Fingerprint, Play, Mail, Network } from "lucide-react"
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

// 区块标题组件
function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  )
}

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
    <div className="flex flex-col h-full overflow-hidden bg-linear-to-b from-background to-muted/20">
      {/* Header Info */}
      <div className="shrink-0 px-4 md:px-6 pt-3 md:pt-4 pb-3 border-b border-border bg-background/95 backdrop-blur-sm">
        {/* IP 信息头部 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Network className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">{head.IP}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{head.Time}</span>
              </div>
            </div>
          </div>
          
          {/* IPv4/IPv6 切换 tabs（双栈时显示） */}
          {isDualStack && (
            <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg p-1">
              {dataArray.map((data, index) => {
                const ip = data.Head[0].IP
                const version = isIPv6(ip) ? 'IPv6' : 'IPv4'
                return (
                  <button
                    key={ip}
                    onClick={() => setActiveIpIndex(index)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      activeIpIndex === index
                        ? version === 'IPv6'
                          ? "bg-blue-500 text-white shadow-sm"
                          : "bg-green-500 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                    )}
                  >
                    {version}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Section Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 pb-0.5">
          {sectionTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap",
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
          <div className="p-4 md:p-5 space-y-4">
            {/* 第一行：基础信息 + IP类型 + 风险评分 */}
            <section ref={(el) => { sectionRefs.current["info"] = el; sectionRefs.current["type"] = el; sectionRefs.current["score"] = el }} className="scroll-mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 基础信息 - 占据更多空间 */}
                <div className="lg:col-span-5">
                  <SectionHeader icon={Globe2} title="基础信息" />
                  <InfoCard info={server.Info[0]} />
                </div>
                {/* IP 类型 */}
                <div className="lg:col-span-3">
                  <SectionHeader icon={Server} title="IP 类型" />
                  <TypeCard type={server.Type[0]} />
                </div>
                {/* 风险评分 */}
                <div className="lg:col-span-4">
                  <SectionHeader icon={ShieldCheck} title="风险评分" />
                  <ScoreCard score={server.Score[0]} />
                </div>
              </div>
            </section>

            {/* 第二行：风险因子 */}
            <section ref={(el) => { sectionRefs.current["factor"] = el }} className="scroll-mt-4">
              <SectionHeader icon={Fingerprint} title="风险因子" />
              <FactorCard factor={server.Factor[0]} />
            </section>

            {/* 第三行：流媒体 + 邮局连通 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <section ref={(el) => { sectionRefs.current["media"] = el }} className="scroll-mt-4">
                <SectionHeader icon={Play} title="流媒体解锁" />
                <MediaCard media={server.Media[0]} />
              </section>

              <section ref={(el) => { sectionRefs.current["mail"] = el }} className="scroll-mt-4">
                <SectionHeader icon={Mail} title="邮局连通性" />
                <MailCard mail={server.Mail[0]} />
              </section>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
