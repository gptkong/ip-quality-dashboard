import { Check, X, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface MailCardProps {
  mail: {
    Port25: boolean
    Gmail: boolean
    Outlook: boolean
    Yahoo: boolean
    Apple: boolean
    QQ: boolean
    MailRU: boolean
    AOL: boolean
    GMX: boolean
    MailCOM: boolean
    "163": boolean
    Sohu: boolean
    Sina: boolean
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

  return (
    <div className="space-y-4">
      {/* 邮件端口检测 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="text-sm font-medium mb-3">邮件端口连通性</div>
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-2">
          {mailProviders.map((provider) => {
            const isOpen = mail[provider as keyof typeof mail] as boolean
            return (
              <div
                key={provider}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-2 text-center border transition-colors",
                  isOpen
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                )}
              >
                {isOpen ? (
                  <Check className="h-4 w-4 text-green-500 mb-1" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mb-1" />
                )}
                <span className="text-[10px] font-medium truncate w-full">{provider}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* DNS 黑名单 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <Shield className="h-4 w-4 text-primary" />
          DNS 黑名单检测
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center border border-border">
            <p className="text-xl font-bold">{blacklist.Total}</p>
            <p className="text-[10px] text-muted-foreground">检测总数</p>
          </div>
          <div className="rounded-lg bg-green-500/10 p-3 text-center border border-green-500/20">
            <p className="text-xl font-bold text-green-500">{blacklist.Clean}</p>
            <p className="text-[10px] text-muted-foreground">干净</p>
          </div>
          <div className="rounded-lg bg-amber-500/10 p-3 text-center border border-amber-500/20">
            <p className="text-xl font-bold text-amber-500">{blacklist.Marked}</p>
            <p className="text-[10px] text-muted-foreground">标记</p>
          </div>
          <div className="rounded-lg bg-red-500/10 p-3 text-center border border-red-500/20">
            <p className="text-xl font-bold text-red-500">{blacklist.Blacklisted}</p>
            <p className="text-[10px] text-muted-foreground">黑名单</p>
          </div>
        </div>

        {/* 进度条 */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>清洁率</span>
            <span className="font-medium text-green-500">{blacklistPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
              style={{ width: `${blacklistPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
