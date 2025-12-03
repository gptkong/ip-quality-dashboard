import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp, Minus, Shield, Activity } from "lucide-react"

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
        barColor: "bg-muted",
      }
    }
    const num = Number.parseFloat(value.replace("%", ""))
    if (num <= 20) {
      return {
        color: "text-emerald-500",
        bg: "bg-emerald-500/5 border-emerald-500/20",
        level: "低风险",
        icon: TrendingDown,
        ring: "ring-1 ring-emerald-500/20",
        barColor: "bg-emerald-500",
      }
    }
    if (num <= 60) {
      return {
        color: "text-amber-500",
        bg: "bg-amber-500/5 border-amber-500/20",
        level: "中风险",
        icon: Activity,
        ring: "ring-1 ring-amber-500/20",
        barColor: "bg-amber-500",
      }
    }
    return {
      color: "text-rose-500",
      bg: "bg-rose-500/5 border-rose-500/20",
      level: "高风险",
      icon: TrendingUp,
      ring: "ring-1 ring-rose-500/20",
      barColor: "bg-rose-500",
    }
  }

  const getProgressWidth = (value: string) => {
    if (value === "null" || value === "N/A") return 0
    return Math.min(Number.parseFloat(value.replace("%", "")), 100)
  }

  const getSummaryScore = () => {
    let total = 0
    let count = 0
    Object.values(score).forEach(v => {
      if (v === "null" || v === "N/A") return
      const num = parseFloat(v.replace("%", ""))
      if (!isNaN(num)) {
        total += num
        count++
      }
    })
    if (count === 0) return null
    return Math.round(total / count)
  }

  const summaryScore = getSummaryScore()
  const summaryInfo = summaryScore !== null ? getScoreInfo(`${summaryScore}%`) : null

  return (
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5 h-full flex flex-col gap-5">
      {/* Summary Section */}
      {summaryInfo && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full border-4 shadow-sm",
            summaryInfo.color.replace("text-", "border-").replace("500", "500/20"),
            summaryInfo.bg
          )}>
            <Shield className={cn("h-5 w-5", summaryInfo.color)} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums tracking-tight">{summaryScore}</span>
              <span className={cn("text-sm font-medium", summaryInfo.color)}>{summaryInfo.level}</span>
            </div>
            <p className="text-xs text-muted-foreground">综合风险评分</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(score).map(([provider, value]) => {
          const info = getScoreInfo(value)
          const Icon = info.icon
          const progress = getProgressWidth(value)
          
          return (
            <div
              key={provider}
              className={cn(
                "group relative overflow-hidden rounded-xl p-3 border transition-all hover:shadow-md",
                info.bg, info.ring
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-muted-foreground truncate pr-2">{provider}</p>
                <Icon className={cn("h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity", info.color)} />
              </div>
              
              <div className="flex items-baseline gap-1.5 mb-2">
                <p className={cn("text-lg font-bold tabular-nums tracking-tight", info.color)}>
                  {value === "null" ? "N/A" : value}
                </p>
                <span className={cn("text-[10px] font-medium opacity-80", info.color)}>
                  {info.level}
                </span>
              </div>
              
              <div className="h-1.5 rounded-full bg-background/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500 ease-out", info.barColor)}
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
