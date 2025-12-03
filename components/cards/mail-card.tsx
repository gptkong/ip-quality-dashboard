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
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5 h-full space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* 邮件端口检测 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/90 uppercase tracking-wider">
              <Mail className="h-3.5 w-3.5 text-primary" />
              端口连通性
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {openCount}/{mailProviders.length} 可用
            </span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-7 xl:grid-cols-5 2xl:grid-cols-7 gap-2">
            {mailProviders.map((provider) => {
              const value = mail[provider as keyof typeof mail]
              const isOpen = value === true
              return (
                <div
                  key={provider}
                  className={cn(
                    "group flex flex-col items-center justify-center rounded-lg p-2 text-center border transition-all hover:scale-105",
                    isOpen
                      ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                      : "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center mb-1 transition-colors",
                    isOpen ? "bg-emerald-500/10 group-hover:bg-emerald-500/20" : "bg-rose-500/10 group-hover:bg-rose-500/20"
                  )}>
                    {isOpen ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <X className="h-3 w-3 text-rose-500" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium truncate w-full opacity-80">{provider}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* DNS 黑名单 */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/90 mb-3 uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5 text-primary" />
            DNS 黑名单
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="rounded-lg bg-muted/30 p-2.5 text-center border border-border/50">
              <p className="text-lg font-bold tabular-nums tracking-tight">{blacklist.Total}</p>
              <p className="text-[10px] text-muted-foreground font-medium">总数</p>
            </div>
            <div className="rounded-lg bg-emerald-500/5 p-2.5 text-center border border-emerald-500/20">
              <p className="text-lg font-bold text-emerald-500 tabular-nums tracking-tight">{blacklist.Clean}</p>
              <p className="text-[10px] text-emerald-500/70 font-medium">干净</p>
            </div>
            <div className="rounded-lg bg-amber-500/5 p-2.5 text-center border border-amber-500/20">
              <p className="text-lg font-bold text-amber-500 tabular-nums tracking-tight">{blacklist.Marked}</p>
              <p className="text-[10px] text-amber-500/70 font-medium">标记</p>
            </div>
            <div className="rounded-lg bg-rose-500/5 p-2.5 text-center border border-rose-500/20">
              <p className="text-lg font-bold text-rose-500 tabular-nums tracking-tight">{blacklist.Blacklisted}</p>
              <p className="text-[10px] text-rose-500/70 font-medium">黑名单</p>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-muted-foreground">清洁率</span>
              <span className="text-emerald-500">{blacklistPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${blacklistPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
