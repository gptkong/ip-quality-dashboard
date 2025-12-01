import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Check, X, AlertCircle } from "lucide-react"

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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "解锁":
        return (
          <Badge className="bg-success/20 text-success hover:bg-success/30 border-success/30">
            <Check className="h-3 w-3 mr-1" />
            解锁
          </Badge>
        )
      case "屏蔽":
        return (
          <Badge
            variant="destructive"
            className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/30"
          >
            <X className="h-3 w-3 mr-1" />
            屏蔽
          </Badge>
        )
      case "仅APP":
        return (
          <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30 border-warning/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            仅APP
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Play className="h-4 w-4 text-primary" />
          流媒体解锁
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(media).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 border border-border"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{mediaLabels[key] || key}</span>
                {value.Region && <span className="text-xs text-muted-foreground">({value.Region})</span>}
              </div>
              <div className="flex items-center gap-2">
                {value.Type && <span className="text-xs text-muted-foreground">{value.Type}</span>}
                {getStatusBadge(value.Status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
