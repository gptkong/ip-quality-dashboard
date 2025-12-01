import { Server, Building } from "lucide-react"

interface TypeCardProps {
  type: {
    Usage: Record<string, string>
    Company: Record<string, string>
  }
}

function getTypeColor(value: string): string {
  const colorMap: Record<string, string> = {
    机房: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    商业: "bg-green-500/15 text-green-500 border-green-500/30",
    住宅: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
    教育: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    政府: "bg-purple-500/15 text-purple-500 border-purple-500/30",
    移动: "bg-rose-500/15 text-rose-500 border-rose-500/30",
    ISP: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
  }
  return colorMap[value] || "bg-muted text-muted-foreground border-border"
}

export function TypeCard({ type }: TypeCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* 使用类型 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <Server className="h-4 w-4 text-primary" />
          使用类型
        </div>
        <div className="space-y-2">
          {Object.entries(type.Usage).map(([provider, value]) => (
            <div key={provider} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{provider}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getTypeColor(value)}`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 公司类型 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <Building className="h-4 w-4 text-primary" />
          公司类型
        </div>
        <div className="space-y-2">
          {Object.entries(type.Company).map(([provider, value]) => (
            <div key={provider} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{provider}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getTypeColor(value)}`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
