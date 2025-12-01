import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScoreCardProps {
  score: Record<string, string>
}

export function ScoreCard({ score }: ScoreCardProps) {
  const getScoreColor = (value: string) => {
    if (value === "null" || value === "N/A") return "text-muted-foreground"
    const num = Number.parseFloat(value.replace("%", ""))
    if (num <= 10) return "text-success"
    if (num <= 50) return "text-warning"
    return "text-destructive"
  }

  const getScoreLevel = (value: string) => {
    if (value === "null" || value === "N/A") return "未知"
    const num = Number.parseFloat(value.replace("%", ""))
    if (num <= 10) return "低风险"
    if (num <= 50) return "中风险"
    return "高风险"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-primary" />
          风险评分
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(score).map(([provider, value]) => (
            <div key={provider} className="rounded-lg bg-muted/50 p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">{provider}</p>
              <div className="flex items-end justify-between">
                <p className={cn("text-2xl font-bold", getScoreColor(value))}>{value === "null" ? "N/A" : value}</p>
                {value !== "null" && (
                  <span className={cn("text-xs", getScoreColor(value))}>{getScoreLevel(value)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
