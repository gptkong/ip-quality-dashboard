import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Building } from "lucide-react"

interface TypeCardProps {
  type: {
    Usage: Record<string, string>
    Company: Record<string, string>
  }
}

function getTypeColor(value: string): string {
  const colorMap: Record<string, string> = {
    机房: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    商业: "bg-green-500/20 text-green-400 border-green-500/50",
    住宅: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    教育: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    政府: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    移动: "bg-rose-500/20 text-rose-400 border-rose-500/50",
    ISP: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
  }
  return colorMap[value] || "bg-muted text-muted-foreground border-border"
}

export function TypeCard({ type }: TypeCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Server className="h-4 w-4 text-primary" />
          IP 类型
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Server className="h-3 w-3" />
            使用类型
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(type.Usage).map(([provider, value]) => (
              <div key={provider} className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{provider}:</span>
                <span
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${getTypeColor(value)}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Building className="h-3 w-3" />
            公司类型
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(type.Company).map(([provider, value]) => (
              <div key={provider} className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{provider}:</span>
                <span
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${getTypeColor(value)}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
