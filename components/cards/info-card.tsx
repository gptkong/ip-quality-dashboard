import { MapPin, Building2, Globe2, Map } from "lucide-react"

interface InfoCardProps {
  info: {
    ASN: string
    Organization: string
    Latitude: string
    Longitude: string
    DMS: string
    Map: string
    TimeZone: string
    City: {
      Name: string
      PostalCode: string
      SubCode: string
      Subdivisions: string
    }
    Region: {
      Code: string
      Name: string
    }
    Continent: {
      Code: string
      Name: string
    }
    RegisteredRegion: {
      Code: string
      Name: string
    }
    Type: string
  }
}

export function InfoCard({ info }: InfoCardProps) {
  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <Globe2 className="h-4 w-4 text-primary" />
          网络信息
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">ASN</p>
            <p className="font-mono text-sm font-medium">{info.ASN}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">类型</p>
            <p className="text-sm font-medium">{info.Type}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-0.5">组织</p>
            <p className="text-sm font-medium truncate">{info.Organization}</p>
          </div>
        </div>
      </div>

      {/* 地理位置 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          地理位置
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">城市</p>
            <p className="text-sm font-medium">{info.City.Name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">地区</p>
            <p className="text-sm font-medium">{info.Region.Name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">大洲</p>
            <p className="text-sm font-medium">{info.Continent.Name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">时区</p>
            <p className="text-sm font-medium">{info.TimeZone}</p>
          </div>
        </div>
      </div>

      {/* 注册地 & 坐标 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Building2 className="h-4 w-4 text-primary" />
            注册地
          </div>
          <p className="text-sm font-medium">
            {info.RegisteredRegion.Name} ({info.RegisteredRegion.Code})
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Map className="h-4 w-4 text-primary" />
            坐标
          </div>
          <p className="text-xs font-mono text-muted-foreground mb-1">{info.DMS}</p>
          <a
            href={info.Map}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            在地图上查看 →
          </a>
        </div>
      </div>
    </div>
  )
}
