import { MapPin, ExternalLink } from "lucide-react"
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
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-xs font-medium", mono && "font-mono")}>{value || "-"}</span>
    </div>
  )
}

export function InfoCard({ info }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-3 h-full">
      <div className="flex flex-col">
        <InfoItem label="ASN" value={info.ASN} mono />
        <InfoItem label="类型" value={info.Type} />
        <InfoItem label="组织" value={info.Organization} />
        <InfoItem label="城市" value={info.City.Name} />
        <InfoItem label="地区" value={info.Region.Name} />
        <InfoItem label="大洲" value={info.Continent.Name} />
        <InfoItem label="时区" value={info.TimeZone} />
        <div className="flex items-center justify-between py-1.5">
          <span className="text-xs text-muted-foreground">坐标</span>
          <a
            href={info.Map}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            <span className="text-[10px] font-mono">{info.DMS}</span>
            <MapPin className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
