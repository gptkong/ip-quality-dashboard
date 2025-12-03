import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

interface ScoreCardProps {
  score: Record<string, string>
}

export function ScoreCard({ score }: ScoreCardProps) {
  const getScoreInfo = (value: string) => {
    if (value === "null" || value === "N/A") {
      return {
        color: "text-muted-foreground",
        bg: "bg-muted/30 border-border",
        level: "未知",
        icon: Minus,
        ring: "",
      }
    }
    const num = Number.parseFloat(value.replace("%", ""))
    if (num <= 10) {
      return {
        color: "text-green-500",
        bg: "bg-green-500/5 border-green-500/20",
        level: "低风险",
        icon: TrendingDown,
        ring: "ring-1 ring-green-500/20",
      }
    }
    if (num <= 50) {
      return {
        color: "text-amber-500",
        bg: "bg-amber-500/5 border-amber-500/20",
        level: "中风险",
        icon: Minus,
        ring: "ring-1 ring-amber-500/20",
      }
    }
    return {
      color: "text-red-500",
      bg: "bg-red-500/5 border-red-500/20",
      level: "高风险",
      icon: TrendingUp,
      ring: "ring-1 ring-red-500/20",
    }
  }

  const getProgressWidth = (value: string) => {
    if (value === "null" || value === "N/A") return 0
    return Math.min(Number.parseFloat(value.replace("%", "")), 100)
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-3 h-full">
      <div className="grid grid-cols-2 gap-2 h-full content-start">
        {Object.entries(score).map(([provider, value]) => {
          const info = getScoreInfo(value)
          const Icon = info.icon
          const progress = getProgressWidth(value)
          
          return (
            <div
              key={provider}
              className={cn(
                "rounded-lg p-2 border transition-all",
                info.bg, info.ring
              )}
            >
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[10px] text-muted-foreground truncate">{provider}</p>
                <Icon className={cn("h-3 w-3 shrink-0", info.color)} />
              </div>
              <div className="flex items-baseline gap-1">
                <p className={cn("text-base font-bold tabular-nums", info.color)}>
                  {value === "null" ? "N/A" : value}
                </p>
                <span className={cn("text-[9px] font-medium", info.color)}>
                  {info.level}
                </span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-muted/50 overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all", info.color.replace("text-", "bg-"))}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
