import { Check, X, Shield, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface MailCardProps {
  mail: {
    Port25: boolean | null
    Gmail: boolean | null
    Outlook: boolean | null
    Yahoo: boolean | null
    Apple: boolean | null
    QQ: boolean | null
    MailRU: boolean | null
    AOL: boolean | null
    GMX: boolean | null
    MailCOM: boolean | null
    "163": boolean | null
    Sohu: boolean | null
    Sina: boolean | null
    DNSBlacklist: {
      Total: number
      Clean: number
      Marked: number
      Blacklisted: number
    }
  }
}

const mailProviders = [
  "Port25",
  "Gmail",
  "Outlook",
  "Yahoo",
  "Apple",
  "QQ",
  "MailRU",
  "AOL",
  "GMX",
  "MailCOM",
  "163",
  "Sohu",
  "Sina",
] as const

export function MailCard({ mail }: MailCardProps) {
  const blacklist = mail.DNSBlacklist
  const blacklistPercent = ((blacklist.Clean / blacklist.Total) * 100).toFixed(1)
  const openCount = mailProviders.filter(p => mail[p as keyof typeof mail] === true).length

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-3 h-full">
      <div className="grid grid-cols-1 gap-3">
        {/* 邮件端口检测 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/90">
              <Mail className="h-3.5 w-3.5 text-primary" />
              端口连通性
            </div>
            <span className="text-[10px] text-muted-foreground">
              {openCount}/{mailProviders.length} 可用
            </span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-7 xl:grid-cols-5 2xl:grid-cols-7 gap-1.5">
            {mailProviders.map((provider) => {
              const value = mail[provider as keyof typeof mail]
              const isOpen = value === true
              return (
                <div
                  key={provider}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md p-1.5 text-center border transition-all",
                    isOpen
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center mb-0.5",
                    isOpen ? "bg-green-500/20" : "bg-red-500/20"
                  )}>
                    {isOpen ? (
                      <Check className="h-2.5 w-2.5 text-green-500" />
                    ) : (
                      <X className="h-2.5 w-2.5 text-red-500" />
                    )}
                  </div>
                  <span className="text-[9px] font-medium truncate w-full">{provider}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* DNS 黑名单 */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/90 mb-2">
            <Shield className="h-3.5 w-3.5 text-primary" />
            DNS 黑名单
          </div>
          
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            <div className="rounded-md bg-muted/30 p-2 text-center border border-border/50">
              <p className="text-sm font-bold">{blacklist.Total}</p>
              <p className="text-[9px] text-muted-foreground">总数</p>
            </div>
            <div className="rounded-md bg-green-500/10 p-2 text-center border border-green-500/20">
              <p className="text-sm font-bold text-green-500">{blacklist.Clean}</p>
              <p className="text-[9px] text-muted-foreground">干净</p>
            </div>
            <div className="rounded-md bg-amber-500/10 p-2 text-center border border-amber-500/20">
              <p className="text-sm font-bold text-amber-500">{blacklist.Marked}</p>
              <p className="text-[9px] text-muted-foreground">标记</p>
            </div>
            <div className="rounded-md bg-red-500/10 p-2 text-center border border-red-500/20">
              <p className="text-sm font-bold text-red-500">{blacklist.Blacklisted}</p>
              <p className="text-[9px] text-muted-foreground">黑名单</p>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">清洁率</span>
              <span className="font-semibold text-green-500">{blacklistPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-600 to-green-400 rounded-full transition-all"
                style={{ width: `${blacklistPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
