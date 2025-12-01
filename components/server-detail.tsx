"use client"

import { useRef } from "react"
import type { ServerData } from "@/lib/mock-data"
import { InfoCard } from "./cards/info-card"
import { TypeCard } from "./cards/type-card"
import { ScoreCard } from "./cards/score-card"
import { FactorCard } from "./cards/factor-card"
import { MediaCard } from "./cards/media-card"
import { MailCard } from "./cards/mail-card"
import { Clock, Terminal, Github } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServerDetailProps {
  server: ServerData
}

const tabs = [
  { id: "info", label: "一、基础信息" },
  { id: "type", label: "二、IP类型属性" },
  { id: "score", label: "三、风险评分" },
  { id: "factor", label: "四、风险因子" },
  { id: "media", label: "五、流媒体及AI解锁" },
  { id: "mail", label: "六、邮局连通性" },
]

export function ServerDetail({ server }: ServerDetailProps) {
  const head = server.Head[0]
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const scrollToSection = (id: string) => {
    const section = sectionRefs.current[id]
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Info */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{head.Time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">{head.Command}</code>
          </div>
          <a
            href={head.GitHub}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <span className="text-xs">{head.Version}</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={cn(
                "px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
                "border-b-2 border-transparent hover:border-primary/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-4xl space-y-8">
          <div ref={(el) => { sectionRefs.current["info"] = el }} className="scroll-mt-4">
            <h2 className="text-lg font-semibold mb-4 text-foreground">一、基础信息</h2>
            <InfoCard info={server.Info[0]} />
          </div>

          <div ref={(el) => { sectionRefs.current["type"] = el }} className="scroll-mt-4">
            <h2 className="text-lg font-semibold mb-4 text-foreground">二、IP类型属性</h2>
            <TypeCard type={server.Type[0]} />
          </div>

          <div ref={(el) => { sectionRefs.current["score"] = el }} className="scroll-mt-4">
            <h2 className="text-lg font-semibold mb-4 text-foreground">三、风险评分</h2>
            <ScoreCard score={server.Score[0]} />
          </div>

          <div ref={(el) => { sectionRefs.current["factor"] = el }} className="scroll-mt-4">
            <h2 className="text-lg font-semibold mb-4 text-foreground">四、风险因子</h2>
            <FactorCard factor={server.Factor[0]} />
          </div>

          <div ref={(el) => { sectionRefs.current["media"] = el }} className="scroll-mt-4">
            <h2 className="text-lg font-semibold mb-4 text-foreground">五、流媒体及AI解锁</h2>
            <MediaCard media={server.Media[0]} />
          </div>

          <div ref={(el) => { sectionRefs.current["mail"] = el }} className="scroll-mt-4">
            <h2 className="text-lg font-semibold mb-4 text-foreground">六、邮局连通性</h2>
            <MailCard mail={server.Mail[0]} />
          </div>
        </div>
      </div>
    </div>
  )
}
