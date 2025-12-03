import { MapPin, Building2, Map, Globe, Clock, Hash, Flag, Network } from "lucide-react"
import { cn } from "@/lib/utils"

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

function InfoItem({
  label,
  value,
  icon: Icon,
  mono = false,
}: {
  label: string
  value: string
  icon?: React.ElementType
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 group hover:bg-muted/30 -mx-3 px-3 transition-colors">
      <div className="flex items-center gap-2.5 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 opacity-70" />}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={cn(
        "text-xs font-medium text-foreground/90 text-right max-w-[60%] truncate",
        mono && "font-mono"
      )}>
        {value || "-"}
      </span>
    </div>
  )
}

export function InfoCard({ info }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5 h-full">
      <div className="flex flex-col">
        <InfoItem label="ASN" value={info.ASN} icon={Hash} mono />
        <InfoItem label="网络类型" value={info.Type} icon={Network} />
        <InfoItem label="组织机构" value={info.Organization} icon={Building2} />
        <InfoItem label="所在城市" value={info.City.Name} icon={MapPin} />
        <InfoItem label="所属地区" value={info.Region.Name} icon={Map} />
        <InfoItem label="所属大洲" value={info.Continent.Name} icon={Globe} />
        <InfoItem label="注册区域" value={info.RegisteredRegion.Name} icon={Flag} />
        <InfoItem label="当前时区" value={info.TimeZone} icon={Clock} />
        
        <div className="flex items-center justify-between py-3 -mx-3 px-3 mt-1 rounded-lg bg-muted/20 border border-border/50">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 opacity-70" />
            <span className="text-xs font-medium">地理坐标</span>
          </div>
          <a
            href={info.Map}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <span className="text-[10px] font-mono font-medium">{info.DMS}</span>
            <MapPin className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
