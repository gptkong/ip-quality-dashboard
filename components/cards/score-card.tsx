import { cn } from "@/lib/utils"

interface ScoreCardProps {
  score: Record<string, string>
}

export function ScoreCard({ score }: ScoreCardProps) {
  const getScoreColor = (value: string) => {
    if (value === "null" || value === "N/A") return "text-muted-foreground"
    const num = Number.parseFloat(value.replace("%", ""))
    if (num <= 10) return "text-green-500"
    if (num <= 50) return "text-amber-500"
    return "text-red-500"
  }

  const getScoreBg = (value: string) => {
    if (value === "null" || value === "N/A") return "bg-muted/50"
    const num = Number.parseFloat(value.replace("%", ""))
    if (num <= 10) return "bg-green-500/10 border-green-500/20"
    if (num <= 50) return "bg-amber-500/10 border-amber-500/20"
    return "bg-red-500/10 border-red-500/20"
  }

  const getScoreLevel = (value: string) => {
    if (value === "null" || value === "N/A") return "未知"
    const num = Number.parseFloat(value.replace("%", ""))
    if (num <= 10) return "低风险"
    if (num <= 50) return "中风险"
    return "高风险"
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Object.entries(score).map(([provider, value]) => (
        <div
          key={provider}
          className={cn(
            "rounded-lg p-3 border transition-colors",
            getScoreBg(value)
          )}
        >
          <p className="text-xs text-muted-foreground mb-1 truncate">{provider}</p>
          <div className="flex items-baseline justify-between gap-2">
            <p className={cn("text-xl font-bold tabular-nums", getScoreColor(value))}>
              {value === "null" ? "N/A" : value}
            </p>
            <span className={cn("text-[10px] font-medium", getScoreColor(value))}>
              {getScoreLevel(value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
