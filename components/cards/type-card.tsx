import { Server, Building } from "lucide-react"
import { cn } from "@/lib/utils"

interface TypeCardProps {
  type: {
    Usage: Record<string, string>
    Company: Record<string, string>
  }
}

function getTypeStyle(value: string) {
  const styleMap: Record<string, { bg: string; text: string; dot: string }> = {
    机房: { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500" },
    商业: { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
    住宅: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500" },
    家宽: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500" },
    教育: { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500" },
    政府: { bg: "bg-purple-500/10", text: "text-purple-500", dot: "bg-purple-500" },
    移动: { bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500" },
    ISP: { bg: "bg-indigo-500/10", text: "text-indigo-500", dot: "bg-indigo-500" },
  }
  return styleMap[value] || { bg: "bg-muted/50", text: "text-muted-foreground", dot: "bg-muted-foreground" }
}

function TypeRow({ provider, value }: { provider: string; value: string }) {
  const style = getTypeStyle(value)
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{provider}</span>
      <span className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style.bg, style.text
      )}>
        <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
        {value}
      </span>
    </div>
  )
}

export function TypeCard({ type }: TypeCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 space-y-4 h-full">
      {/* 使用类型 */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-foreground/90 mb-2">
          <Server className="h-3.5 w-3.5 text-primary" />
          使用类型
        </div>
        <div className="divide-y divide-border/30">
          {Object.entries(type.Usage).map(([provider, value]) => (
            <TypeRow key={provider} provider={provider} value={value} />
          ))}
        </div>
      </div>

      {/* 公司类型 */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-foreground/90 mb-2">
          <Building className="h-3.5 w-3.5 text-primary" />
          公司类型
        </div>
        <div className="divide-y divide-border/30">
          {Object.entries(type.Company).map(([provider, value]) => (
            <TypeRow key={provider} provider={provider} value={value} />
          ))}
        </div>
      </div>
    </div>
  )
}
