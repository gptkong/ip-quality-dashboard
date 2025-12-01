import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe2 className="h-4 w-4 text-primary" />
          基本信息
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">ASN</p>
            <p className="font-mono font-medium">{info.ASN}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">类型</p>
            <p className="font-medium">{info.Type}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">组织</p>
            <p className="font-medium truncate">{info.Organization}</p>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3" />
            地理位置
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">城市</p>
              <p className="font-medium">{info.City.Name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">地区</p>
              <p className="font-medium">{info.Region.Name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">大洲</p>
              <p className="font-medium">{info.Continent.Name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">时区</p>
              <p className="font-medium text-xs">{info.TimeZone}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Building2 className="h-3 w-3" />
            注册地
          </div>
          <p className="text-sm font-medium">
            {info.RegisteredRegion.Name} ({info.RegisteredRegion.Code})
          </p>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Map className="h-3 w-3" />
            坐标
          </div>
          <p className="text-xs font-mono text-muted-foreground">{info.DMS}</p>
          <a
            href={info.Map}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mt-1 inline-block"
          >
            在地图上查看 →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
