"use client"

import { useRef, useState, useEffect } from "react"
import type { ServerData } from "@/lib/mock-data"
import { InfoCard } from "./cards/info-card"
import { TypeCard } from "./cards/type-card"
import { ScoreCard } from "./cards/score-card"
import { FactorCard } from "./cards/factor-card"
import { MediaCard } from "./cards/media-card"
import { MailCard } from "./cards/mail-card"
import { Clock, Terminal, Github, Globe2, Server, ShieldCheck, Fingerprint, Play, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServerDetailProps {
  server: ServerData
}

const tabs = [
  { id: "info", label: "基础信息", icon: Globe2 },
  { id: "type", label: "IP类型", icon: Server },
  { id: "score", label: "风险评分", icon: ShieldCheck },
  { id: "factor", label: "风险因子", icon: Fingerprint },
  { id: "media", label: "流媒体", icon: Play },
  { id: "mail", label: "邮局连通", icon: Mail },
]

export function ServerDetail({ server }: ServerDetailProps) {
  const head = server.Head[0]
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [activeTab, setActiveTab] = useState("info")

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
      
      for (const tab of tabs) {
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
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header Info */}
      <div className="shrink-0 px-6 pt-4 pb-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">{head.Time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" />
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{head.Command}</code>
          </div>
          <a
            href={head.GitHub}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="text-xs">GitHub</span>
          </a>
          <span className="text-xs opacity-60">{head.Version}</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
          {tabs.map((tab) => {
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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
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
      </div>
    </div>
  )
}
