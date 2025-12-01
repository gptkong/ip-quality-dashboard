import { Check, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTiktok,
  faYoutube,
  faSpotify,
  faAmazon,
  faOpenai,
} from "@fortawesome/free-brands-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

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

// 自定义 SVG 图标组件
function DisneyPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.064 12.406c-.063.063-.063.156 0 .218l.875.875c.063.063.156.063.218 0l.875-.875c.063-.063.063-.156 0-.218l-.875-.875c-.063-.063-.156-.063-.218 0l-.875.875zm18.997-1.531c-.063-.063-.156-.063-.218 0l-.875.875c-.063.063-.063.156 0 .218l.875.875c.063.063.156.063.218 0l.875-.875c.063-.063.063-.156 0-.218l-.875-.875zM12 2c-.125 0-.219.094-.219.219v1.25c0 .125.094.218.219.218s.219-.093.219-.218v-1.25C12.219 2.094 12.125 2 12 2zm0 18.313c-.125 0-.219.093-.219.218v1.25c0 .125.094.219.219.219s.219-.094.219-.219v-1.25c0-.125-.094-.218-.219-.218zM12 5.5c-3.594 0-6.5 2.906-6.5 6.5s2.906 6.5 6.5 6.5 6.5-2.906 6.5-6.5-2.906-6.5-6.5-6.5z"/>
    </svg>
  )
}

function NetflixIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"/>
    </svg>
  )
}

const mediaConfig: Record<string, { 
  label: string
  icon: IconDefinition | "disney" | "netflix"
  color: string 
}> = {
  TikTok: { label: "TikTok", icon: faTiktok, color: "text-[#00f2ea]" },
  DisneyPlus: { label: "Disney+", icon: "disney", color: "text-blue-500" },
  Netflix: { label: "Netflix", icon: "netflix", color: "text-red-600" },
  Youtube: { label: "YouTube", icon: faYoutube, color: "text-red-500" },
  AmazonPrimeVideo: { label: "Prime Video", icon: faAmazon, color: "text-sky-500" },
  Spotify: { label: "Spotify", icon: faSpotify, color: "text-green-500" },
  ChatGPT: { label: "ChatGPT", icon: faOpenai, color: "text-white" },
}

export function MediaCard({ media }: MediaCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "解锁":
        return {
          bg: "bg-green-500/10 border-green-500/20 hover:bg-green-500/15",
          icon: <Check className="h-3.5 w-3.5 text-green-500" />,
          text: "text-green-500",
        }
      case "屏蔽":
        return {
          bg: "bg-red-500/10 border-red-500/20 hover:bg-red-500/15",
          icon: <X className="h-3.5 w-3.5 text-red-500" />,
          text: "text-red-500",
        }
      case "仅APP":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15",
          icon: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
          text: "text-amber-500",
        }
      default:
        return {
          bg: "bg-muted/50 border-border hover:bg-muted",
          icon: null,
          text: "text-muted-foreground",
        }
    }
  }

  const renderIcon = (key: string) => {
    const config = mediaConfig[key]
    if (!config) return null

    if (config.icon === "disney") {
      return <DisneyPlusIcon className={cn("h-5 w-5", config.color)} />
    }
    if (config.icon === "netflix") {
      return <NetflixIcon className={cn("h-5 w-5", config.color)} />
    }
    return <FontAwesomeIcon icon={config.icon} className={cn("h-5 w-5", config.color)} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {Object.entries(media).map(([key, value]) => {
        const style = getStatusStyle(value.Status)
        const config = mediaConfig[key]
        return (
          <div
            key={key}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-colors",
              style.bg
            )}
          >
            {/* 服务图标 */}
            <div className="shrink-0 w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center border border-border/50">
              {renderIcon(key)}
            </div>

            {/* 服务信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{config?.label || key}</p>
                <span className={cn("shrink-0 text-xs font-medium", style.text)}>
                  {value.Status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {value.Region && <span>{value.Region}</span>}
                {value.Region && value.Type && <span>·</span>}
                {value.Type && <span>{value.Type}</span>}
              </div>
            </div>

            {/* 状态图标 */}
            <div className={cn(
              "shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
              value.Status === "解锁" ? "bg-green-500/20" :
              value.Status === "屏蔽" ? "bg-red-500/20" :
              value.Status === "仅APP" ? "bg-amber-500/20" : "bg-muted"
            )}>
              {style.icon}
            </div>
          </div>
        )
      })}
    </div>
  )
}
