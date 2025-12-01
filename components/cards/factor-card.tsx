import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fingerprint, Check, X, Minus } from "lucide-react"

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
    if (value === null) return <Minus className="h-3 w-3 text-muted-foreground" />
    if (value) return <X className="h-3 w-3 text-destructive" />
    return <Check className="h-3 w-3 text-success" />
  }

  return (
    <Card className="bg-card border-border lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Fingerprint className="h-4 w-4 text-primary" />
          检测因素
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">来源</th>
                {factorKeys.map((key) => (
                  <th key={key} className="pb-2 text-center text-xs font-medium text-muted-foreground">
                    {factorLabels[key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider} className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-xs font-medium">{provider}</td>
                  {factorKeys.map((key) => {
                    const value = factor[key][provider as keyof typeof factor.Proxy]
                    return (
                      <td key={key} className="py-2 text-center">
                        <div className="flex justify-center">{getStatusIcon(value as boolean | null)}</div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
          <div className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-success" />
            <span>未检测到</span>
          </div>
          <div className="flex items-center gap-1.5">
            <X className="h-3 w-3 text-destructive" />
            <span>已检测到</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Minus className="h-3 w-3 text-muted-foreground" />
            <span>无数据</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
