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

// 风险等级计算
function getRiskLevel(scores: Record<string, string>) {
  let maxScore = 0
  let hasScore = false
  
  Object.values(scores).forEach(s => {
    if (s === 'null' || s === 'N/A') return
    const num = Number.parseFloat(s.replace('%', ''))
    if (!isNaN(num)) {
      maxScore = Math.max(maxScore, num)
      hasScore = true
    }
  })
  
  if (!hasScore) return { label: '未知风险', color: 'bg-muted/50 text-muted-foreground border-border', icon: ShieldCheck }
  if (maxScore <= 20) return { label: '低风险', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: ShieldCheck }
  if (maxScore <= 60) return { label: '中风险', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: ShieldCheck }
  return { label: '高风险', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: ShieldCheck }
}

// 区块标题组件
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 ring-1 ring-primary/20">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground leading-none">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
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

  const riskInfo = getRiskLevel(server.Score[0])
  const RiskIcon = riskInfo.icon

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted/10">
      {/* Header Info */}
      <div className="shrink-0 bg-background border-b border-border">
        <div className="px-6 py-5">
          {/* IP 信息头部 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-sm">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">{head.IP}</h1>
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    riskInfo.color
                  )}>
                    <RiskIcon className="h-3 w-3" />
                    {riskInfo.label}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>检测时间: {head.Time}</span>
                  </div>
                  {isDualStack && (
                    <div className="flex items-center gap-2">
                      <div className="w-px h-3 bg-border" />
                      <div className="flex gap-1">
                        {dataArray.map((data, index) => {
                          const ip = data.Head[0].IP
                          const version = isIPv6(ip) ? 'IPv6' : 'IPv4'
                          return (
                            <button
                              key={ip}
                              onClick={() => setActiveIpIndex(index)}
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-medium rounded-md transition-all border",
                                activeIpIndex === index
                                  ? version === 'IPv6'
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    : "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                              )}
                            >
                              {version}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" ref={scrollContainerRef}>
          <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* 第一行：基础信息 + 风险评分 */}
            <section ref={(el) => { sectionRefs.current["info"] = el; sectionRefs.current["score"] = el }} className="scroll-mt-24">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* 基础信息 */}
                <div className="xl:col-span-4 flex flex-col">
                  <SectionHeader icon={Globe2} title="基础信息" subtitle="IP 地理位置与归属信息" />
                  <div className="flex-1">
                    <InfoCard info={server.Info[0]} />
                  </div>
                </div>
                {/* 风险评分 */}
                <div className="xl:col-span-8 flex flex-col">
                  <SectionHeader icon={ShieldCheck} title="风险评分" subtitle="多维度 IP 风险评估结果" />
                  <div className="flex-1">
                    <ScoreCard score={server.Score[0]} />
                  </div>
                </div>
              </div>
            </section>

            {/* 第二行：IP类型 + 风险因子 */}
            <section ref={(el) => { sectionRefs.current["type"] = el; sectionRefs.current["factor"] = el }} className="scroll-mt-24">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* IP 类型 */}
                <div className="xl:col-span-4 flex flex-col">
                  <SectionHeader icon={Server} title="IP 类型" subtitle="网络类型与使用场景" />
                  <div className="flex-1">
                    <TypeCard type={server.Type[0]} />
                  </div>
                </div>
                {/* 风险因子 */}
                <div className="xl:col-span-8 flex flex-col">
                  <SectionHeader icon={Fingerprint} title="风险因子" subtitle="潜在的安全威胁指标" />
                  <div className="flex-1">
                    <FactorCard factor={server.Factor[0]} />
                  </div>
                </div>
              </div>
            </section>

            {/* 第三行：流媒体 */}
            <section ref={(el) => { sectionRefs.current["media"] = el }} className="scroll-mt-24">
              <SectionHeader icon={Play} title="流媒体解锁" subtitle="主流流媒体平台访问支持" />
              <MediaCard media={server.Media[0]} />
            </section>

            {/* 第四行：邮局连通 */}
            <section ref={(el) => { sectionRefs.current["mail"] = el }} className="scroll-mt-24">
              <SectionHeader icon={Mail} title="邮局连通性" subtitle="常见邮件服务端口连通状态" />
              <MailCard mail={server.Mail[0]} />
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
