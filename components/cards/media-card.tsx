import { Check, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  media: Record<
    string,
    {
      Status: string
      Region: string
      Type: string
    }
  >
}

const mediaLabels: Record<string, string> = {
  TikTok: "TikTok",
  DisneyPlus: "Disney+",
  Netflix: "Netflix",
  Youtube: "YouTube",
  AmazonPrimeVideo: "Prime Video",
  Spotify: "Spotify",
  ChatGPT: "ChatGPT",
}

export function MediaCard({ media }: MediaCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "解锁":
        return {
          bg: "bg-green-500/10 border-green-500/20",
          icon: <Check className="h-4 w-4 text-green-500" />,
          text: "text-green-500",
        }
      case "屏蔽":
        return {
          bg: "bg-red-500/10 border-red-500/20",
          icon: <X className="h-4 w-4 text-red-500" />,
          text: "text-red-500",
        }
      case "仅APP":
        return {
          bg: "bg-amber-500/10 border-amber-500/20",
          icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
          text: "text-amber-500",
        }
      default:
        return {
          bg: "bg-muted/50 border-border",
          icon: null,
          text: "text-muted-foreground",
        }
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Object.entries(media).map(([key, value]) => {
        const style = getStatusStyle(value.Status)
        return (
          <div
            key={key}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3 transition-colors",
              style.bg
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                value.Status === "解锁" ? "bg-green-500/20" :
                value.Status === "屏蔽" ? "bg-red-500/20" :
                value.Status === "仅APP" ? "bg-amber-500/20" : "bg-muted"
              )}>
                {style.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{mediaLabels[key] || key}</p>
                {value.Region && (
                  <p className="text-xs text-muted-foreground">{value.Region}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={cn("text-xs font-medium", style.text)}>
                {value.Status}
              </span>
              {value.Type && (
                <p className="text-[10px] text-muted-foreground">{value.Type}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
