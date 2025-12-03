import { Check, X, Minus, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react"
import { cn } from "@/lib/utils"

interface FactorCardProps {
  factor: {
    CountryCode: Record<string, string | null>
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
    if (value === null) return <Minus className="h-3 w-3 text-muted-foreground/50" />
    if (value) return <X className="h-3.5 w-3.5 text-rose-500" />
    return <Check className="h-3.5 w-3.5 text-emerald-500" />
  }

  const getStatusStyle = (value: boolean | null) => {
    if (value === null) return "bg-muted/20 border-border/30"
    if (value) return "bg-rose-500/10 border-rose-500/20 shadow-sm shadow-rose-500/5"
    return "bg-emerald-500/10 border-emerald-500/20 shadow-sm shadow-emerald-500/5"
  }

  return (
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border/50 bg-muted/40">
              <th className="px-4 py-3.5 text-left text-[11px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap sticky left-0 bg-muted/40 backdrop-blur-sm z-10">
                数据源
              </th>
              {factorKeys.map((key) => (
                <th key={key} className="px-2 py-3.5 text-center text-[11px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap">
                  {factorLabels[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {providers.map((provider, idx) => (
              <tr
                key={provider}
                className={cn(
                  "transition-colors hover:bg-muted/30",
                  idx % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                )}
              >
                <td className="px-4 py-3 text-xs font-medium text-foreground/80 sticky left-0 bg-background/50 backdrop-blur-sm z-10">{provider}</td>
                {factorKeys.map((key) => {
                  const value = factor[key][provider as keyof typeof factor.Proxy]
                  return (
                    <td key={key} className="px-2 py-3 text-center">
                      <div className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-300",
                        getStatusStyle(value as boolean | null)
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
      <div className="flex items-center justify-center gap-6 px-4 py-3 text-xs text-muted-foreground border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
          </div>
          <span>安全</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ShieldAlert className="h-3 w-3 text-rose-500" />
          </div>
          <span>检测到</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-muted/30 border border-border/50 flex items-center justify-center">
            <ShieldQuestion className="h-3 w-3 text-muted-foreground" />
          </div>
          <span>无数据</span>
        </div>
      </div>
    </div>
  )
}
