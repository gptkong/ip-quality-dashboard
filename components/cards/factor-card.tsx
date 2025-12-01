import { Check, X, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FactorCardProps {
  factor: {
    CountryCode: Record<string, string>
    Proxy: Record<string, boolean | null>
    Tor: Record<string, boolean | null>
    VPN: Record<string, boolean | null>
    Server: Record<string, boolean | null>
    Abuser: Record<string, boolean | null>
    Robot: Record<string, boolean | null>
  }
}

const factorLabels: Record<string, string> = {
  Proxy: "代理",
  Tor: "Tor",
  VPN: "VPN",
  Server: "服务器",
  Abuser: "滥用者",
  Robot: "机器人",
}

export function FactorCard({ factor }: FactorCardProps) {
  const factorKeys = ["Proxy", "Tor", "VPN", "Server", "Abuser", "Robot"] as const
  const providers = Object.keys(factor.Proxy)

  const getStatusIcon = (value: boolean | null) => {
    if (value === null) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
    if (value) return <X className="h-3.5 w-3.5 text-red-500" />
    return <Check className="h-3.5 w-3.5 text-green-500" />
  }

  const getStatusBg = (value: boolean | null) => {
    if (value === null) return "bg-muted/50"
    if (value) return "bg-red-500/10"
    return "bg-green-500/10"
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">数据源</th>
              {factorKeys.map((key) => (
                <th key={key} className="px-3 py-2.5 text-center text-xs font-medium text-muted-foreground">
                  {factorLabels[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {providers.map((provider, idx) => (
              <tr
                key={provider}
                className={cn(
                  "border-b border-border/50 last:border-0",
                  idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                )}
              >
                <td className="px-4 py-2 text-xs font-medium">{provider}</td>
                {factorKeys.map((key) => {
                  const value = factor[key][provider as keyof typeof factor.Proxy]
                  return (
                    <td key={key} className="px-3 py-2 text-center">
                      <div className={cn(
                        "inline-flex items-center justify-center w-6 h-6 rounded-full",
                        getStatusBg(value as boolean | null)
                      )}>
                        {getStatusIcon(value as boolean | null)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 px-4 py-2.5 text-xs text-muted-foreground border-t border-border bg-muted/20">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-500" />
          </div>
          <span>安全</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center">
            <X className="h-3 w-3 text-red-500" />
          </div>
          <span>检测到</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center">
            <Minus className="h-3 w-3 text-muted-foreground" />
          </div>
          <span>无数据</span>
        </div>
      </div>
    </div>
  )
}
