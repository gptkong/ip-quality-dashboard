"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ServerData } from "@/lib/mock-data"
import { InfoCard } from "./cards/info-card"
import { TypeCard } from "./cards/type-card"
import { ScoreCard } from "./cards/score-card"
import { FactorCard } from "./cards/factor-card"
import { MediaCard } from "./cards/media-card"
import { MailCard } from "./cards/mail-card"
import { Clock, Terminal, Github } from "lucide-react"

interface ServerDetailProps {
  server: ServerData
}

export function ServerDetail({ server }: ServerDetailProps) {
  const head = server.Head[0]

  return (
    <div className="p-6">
      {/* Header Info */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0 h-auto flex-wrap">
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
          >
            一、基础信息
          </TabsTrigger>
          <TabsTrigger
            value="type"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
          >
            二、IP类型属性
          </TabsTrigger>
          <TabsTrigger
            value="score"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
          >
            三、风险评分
          </TabsTrigger>
          <TabsTrigger
            value="factor"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
          >
            四、风险因子
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
          >
            五、流媒体及AI解锁
          </TabsTrigger>
          <TabsTrigger
            value="mail"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
          >
            六、邮局连通性
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="pt-4 max-w-4xl">
          <InfoCard info={server.Info[0]} />
        </TabsContent>
        <TabsContent value="type" className="pt-4 max-w-4xl">
          <TypeCard type={server.Type[0]} />
        </TabsContent>
        <TabsContent value="score" className="pt-4 max-w-4xl">
          <ScoreCard score={server.Score[0]} />
        </TabsContent>
        <TabsContent value="factor" className="pt-4 max-w-4xl">
          <FactorCard factor={server.Factor[0]} />
        </TabsContent>
        <TabsContent value="media" className="pt-4 max-w-4xl">
          <MediaCard media={server.Media[0]} />
        </TabsContent>
        <TabsContent value="mail" className="pt-4 max-w-4xl">
          <MailCard mail={server.Mail[0]} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
