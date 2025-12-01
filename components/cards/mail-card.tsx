import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Check, X, Shield } from "lucide-react"
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
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-4 w-4 text-primary" />
          邮件端口检测
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {mailProviders.map((provider) => {
            const isOpen = mail[provider as keyof typeof mail] as boolean
            return (
              <div
                key={provider}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-2 text-center border",
                  isOpen ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30",
                )}
              >
                {isOpen ? (
                  <Check className="h-4 w-4 text-success mb-1" />
                ) : (
                  <X className="h-4 w-4 text-destructive mb-1" />
                )}
                <span className="text-xs font-medium">{provider}</span>
              </div>
            )
          })}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Shield className="h-3 w-3" />
            DNS 黑名单
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="rounded-lg bg-muted/50 p-2 border border-border">
              <p className="text-lg font-bold">{blacklist.Total}</p>
              <p className="text-xs text-muted-foreground">总数</p>
            </div>
            <div className="rounded-lg bg-success/10 p-2 border border-success/30">
              <p className="text-lg font-bold text-success">{blacklist.Clean}</p>
              <p className="text-xs text-muted-foreground">干净</p>
            </div>
            <div className="rounded-lg bg-warning/10 p-2 border border-warning/30">
              <p className="text-lg font-bold text-warning-foreground">{blacklist.Marked}</p>
              <p className="text-xs text-muted-foreground">标记</p>
            </div>
            <div className="rounded-lg bg-destructive/10 p-2 border border-destructive/30">
              <p className="text-lg font-bold text-destructive">{blacklist.Blacklisted}</p>
              <p className="text-xs text-muted-foreground">黑名单</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>清洁率</span>
              <span>{blacklistPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all"
                style={{ width: `${blacklistPercent}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
