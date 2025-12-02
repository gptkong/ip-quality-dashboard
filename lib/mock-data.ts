export interface ServerData {
  Head: Array<{
    IP: string
    Command: string
    GitHub: string
    Time: string
    Version: string
  }>
  Info: Array<{
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
  }>
  Type: Array<{
    Usage: Record<string, string>
    Company: Record<string, string>
  }>
  Score: Array<Record<string, string>>
  Factor: Array<{
    CountryCode: Record<string, string>
    Proxy: Record<string, boolean | null>
    Tor: Record<string, boolean | null>
    VPN: Record<string, boolean | null>
    Server: Record<string, boolean | null>
    Abuser: Record<string, boolean | null>
    Robot: Record<string, boolean | null>
  }>
  Media: Array<
    Record<
      string,
      {
        Status: string
        Region: string
        Type: string
      }
    >
  >
  Mail: Array<{
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
  }>
}

export const mockServers: ServerData[] = [
  {
    Head: [
      {
        IP: "47.238.*.*",
        Command: "bash <(curl -sL https://Check.Place) -I",
        GitHub: "https://github.com/xykt/IPQuality",
        Time: "报告时间：2025-12-01 17:29:37 CST",
        Version: "脚本版本：v2025-12-01",
      },
    ],
    Info: [
      {
        ASN: "45102",
        Organization: "Alibaba US Technology Co., Ltd.",
        Latitude: "22.2842",
        Longitude: "114.1759",
        DMS: "114°10′33″E, 22°17′3″N",
        Map: "https://check.place/22.2842,114.1759,15,cn",
        TimeZone: "Asia/Hong_Kong",
        City: {
          Name: "香港",
          PostalCode: "null",
          SubCode: "N/A",
          Subdivisions: "N/A",
        },
        Region: {
          Code: "HK",
          Name: "香港",
        },
        Continent: {
          Code: "AS",
          Name: "亚洲",
        },
        RegisteredRegion: {
          Code: "US",
          Name: "美国",
        },
        Type: "广播IP",
      },
    ],
    Type: [
      {
        Usage: {
          IPinfo: "机房",
          ipregistry: "机房",
          ipapi: "商业",
          AbuseIPDB: "机房",
          IP2LOCATION: "机房",
        },
        Company: {
          IPinfo: "机房",
          ipregistry: "机房",
          ipapi: "机房",
        },
      },
    ],
    Score: [
      {
        IP2LOCATION: "3",
        SCAMALYTICS: "0",
        ipapi: "0.95%",
        AbuseIPDB: "0",
        IPQS: "null",
        DBIP: "0",
      },
    ],
    Factor: [
      {
        CountryCode: {
          IP2LOCATION: "HK",
          ipapi: "HK",
          ipregistry: "CN",
          IPQS: "HK",
          SCAMALYTICS: "HK",
          ipdata: "HK",
          IPinfo: "HK",
          IPWHOIS: "HK",
          DBIP: "HK",
        },
        Proxy: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: true,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        Tor: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: null,
        },
        VPN: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: true,
          SCAMALYTICS: false,
          ipdata: null,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: null,
        },
        Server: {
          IP2LOCATION: true,
          ipapi: true,
          ipregistry: true,
          IPQS: null,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: true,
          IPWHOIS: true,
          DBIP: null,
        },
        Abuser: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: null,
          IPWHOIS: null,
          DBIP: false,
        },
        Robot: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: null,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: null,
          IPinfo: null,
          IPWHOIS: null,
          DBIP: false,
        },
      },
    ],
    Media: [
      {
        TikTok: {
          Status: "解锁",
          Region: "ALISG",
          Type: "原生",
        },
        DisneyPlus: {
          Status: "屏蔽",
          Region: "",
          Type: "",
        },
        Netflix: {
          Status: "解锁",
          Region: "HK",
          Type: "原生",
        },
        Youtube: {
          Status: "解锁",
          Region: "HK",
          Type: "原生",
        },
        AmazonPrimeVideo: {
          Status: "解锁",
          Region: "HK",
          Type: "原生",
        },
        Spotify: {
          Status: "解锁",
          Region: "HK",
          Type: "原生",
        },
        ChatGPT: {
          Status: "仅APP",
          Region: "HK",
          Type: "原生",
        },
      },
    ],
    Mail: [
      {
        Port25: false,
        Gmail: false,
        Outlook: false,
        Yahoo: false,
        Apple: false,
        QQ: false,
        MailRU: false,
        AOL: false,
        GMX: false,
        MailCOM: false,
        "163": false,
        Sohu: false,
        Sina: false,
        DNSBlacklist: {
          Total: 439,
          Clean: 416,
          Marked: 23,
          Blacklisted: 0,
        },
      },
    ],
  },
  {
    Head: [
      {
        IP: "103.152.*.*",
        Command: "bash <(curl -sL https://Check.Place) -I",
        GitHub: "https://github.com/xykt/IPQuality",
        Time: "报告时间：2025-12-01 16:45:22 CST",
        Version: "脚本版本：v2025-12-01",
      },
    ],
    Info: [
      {
        ASN: "132203",
        Organization: "Tencent Building, Kejizhongyi Avenue",
        Latitude: "35.6895",
        Longitude: "139.6917",
        DMS: "139°41′30″E, 35°41′22″N",
        Map: "https://check.place/35.6895,139.6917,15,cn",
        TimeZone: "Asia/Tokyo",
        City: {
          Name: "东京",
          PostalCode: "100-0001",
          SubCode: "13",
          Subdivisions: "Tokyo",
        },
        Region: {
          Code: "JP",
          Name: "日本",
        },
        Continent: {
          Code: "AS",
          Name: "亚洲",
        },
        RegisteredRegion: {
          Code: "CN",
          Name: "中国",
        },
        Type: "数据中心IP",
      },
    ],
    Type: [
      {
        Usage: {
          IPinfo: "机房",
          ipregistry: "机房",
          ipapi: "机房",
          AbuseIPDB: "机房",
          IP2LOCATION: "机房",
        },
        Company: {
          IPinfo: "机房",
          ipregistry: "机房",
          ipapi: "机房",
        },
      },
    ],
    Score: [
      {
        IP2LOCATION: "5",
        SCAMALYTICS: "12",
        ipapi: "2.35%",
        AbuseIPDB: "3",
        IPQS: "15",
        DBIP: "2",
      },
    ],
    Factor: [
      {
        CountryCode: {
          IP2LOCATION: "JP",
          ipapi: "JP",
          ipregistry: "JP",
          IPQS: "JP",
          SCAMALYTICS: "JP",
          ipdata: "JP",
          IPinfo: "JP",
          IPWHOIS: "JP",
          DBIP: "JP",
        },
        Proxy: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        Tor: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        VPN: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        Server: {
          IP2LOCATION: true,
          ipapi: true,
          ipregistry: true,
          IPQS: true,
          SCAMALYTICS: true,
          ipdata: true,
          IPinfo: true,
          IPWHOIS: true,
          DBIP: true,
        },
        Abuser: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        Robot: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
      },
    ],
    Media: [
      {
        TikTok: {
          Status: "解锁",
          Region: "JP",
          Type: "原生",
        },
        DisneyPlus: {
          Status: "解锁",
          Region: "JP",
          Type: "原生",
        },
        Netflix: {
          Status: "解锁",
          Region: "JP",
          Type: "原生",
        },
        Youtube: {
          Status: "解锁",
          Region: "JP",
          Type: "原生",
        },
        AmazonPrimeVideo: {
          Status: "解锁",
          Region: "JP",
          Type: "原生",
        },
        Spotify: {
          Status: "解锁",
          Region: "JP",
          Type: "原生",
        },
        ChatGPT: {
          Status: "解锁",
          Region: "JP",
          Type: "原生",
        },
      },
    ],
    Mail: [
      {
        Port25: true,
        Gmail: true,
        Outlook: true,
        Yahoo: true,
        Apple: true,
        QQ: true,
        MailRU: false,
        AOL: true,
        GMX: true,
        MailCOM: true,
        "163": true,
        Sohu: true,
        Sina: true,
        DNSBlacklist: {
          Total: 439,
          Clean: 435,
          Marked: 4,
          Blacklisted: 0,
        },
      },
    ],
  },
  {
    Head: [
      {
        IP: "185.199.*.*",
        Command: "bash <(curl -sL https://Check.Place) -I",
        GitHub: "https://github.com/xykt/IPQuality",
        Time: "报告时间：2025-12-01 15:12:08 CST",
        Version: "脚本版本：v2025-12-01",
      },
    ],
    Info: [
      {
        ASN: "16509",
        Organization: "Amazon.com, Inc.",
        Latitude: "37.5665",
        Longitude: "126.9780",
        DMS: "126°58′41″E, 37°33′59″N",
        Map: "https://check.place/37.5665,126.9780,15,cn",
        TimeZone: "Asia/Seoul",
        City: {
          Name: "首尔",
          PostalCode: "04524",
          SubCode: "11",
          Subdivisions: "Seoul",
        },
        Region: {
          Code: "KR",
          Name: "韩国",
        },
        Continent: {
          Code: "AS",
          Name: "亚洲",
        },
        RegisteredRegion: {
          Code: "US",
          Name: "美国",
        },
        Type: "云服务IP",
      },
    ],
    Type: [
      {
        Usage: {
          IPinfo: "云服务",
          ipregistry: "云服务",
          ipapi: "云服务",
          AbuseIPDB: "机房",
          IP2LOCATION: "云服务",
        },
        Company: {
          IPinfo: "云服务",
          ipregistry: "云服务",
          ipapi: "云服务",
        },
      },
    ],
    Score: [
      {
        IP2LOCATION: "8",
        SCAMALYTICS: "25",
        ipapi: "5.12%",
        AbuseIPDB: "12",
        IPQS: "30",
        DBIP: "5",
      },
    ],
    Factor: [
      {
        CountryCode: {
          IP2LOCATION: "KR",
          ipapi: "KR",
          ipregistry: "KR",
          IPQS: "KR",
          SCAMALYTICS: "KR",
          ipdata: "KR",
          IPinfo: "KR",
          IPWHOIS: "KR",
          DBIP: "KR",
        },
        Proxy: {
          IP2LOCATION: true,
          ipapi: false,
          ipregistry: false,
          IPQS: true,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        Tor: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        VPN: {
          IP2LOCATION: true,
          ipapi: true,
          ipregistry: false,
          IPQS: true,
          SCAMALYTICS: true,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        Server: {
          IP2LOCATION: true,
          ipapi: true,
          ipregistry: true,
          IPQS: true,
          SCAMALYTICS: true,
          ipdata: true,
          IPinfo: true,
          IPWHOIS: true,
          DBIP: true,
        },
        Abuser: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: true,
          IPQS: false,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
        Robot: {
          IP2LOCATION: false,
          ipapi: false,
          ipregistry: false,
          IPQS: true,
          SCAMALYTICS: false,
          ipdata: false,
          IPinfo: false,
          IPWHOIS: false,
          DBIP: false,
        },
      },
    ],
    Media: [
      {
        TikTok: {
          Status: "屏蔽",
          Region: "",
          Type: "",
        },
        DisneyPlus: {
          Status: "屏蔽",
          Region: "",
          Type: "",
        },
        Netflix: {
          Status: "仅APP",
          Region: "KR",
          Type: "DNS解锁",
        },
        Youtube: {
          Status: "解锁",
          Region: "KR",
          Type: "原生",
        },
        AmazonPrimeVideo: {
          Status: "屏蔽",
          Region: "",
          Type: "",
        },
        Spotify: {
          Status: "解锁",
          Region: "KR",
          Type: "原生",
        },
        ChatGPT: {
          Status: "屏蔽",
          Region: "",
          Type: "",
        },
      },
    ],
    Mail: [
      {
        Port25: false,
        Gmail: false,
        Outlook: false,
        Yahoo: false,
        Apple: false,
        QQ: false,
        MailRU: false,
        AOL: false,
        GMX: false,
        MailCOM: false,
        "163": false,
        Sohu: false,
        Sina: false,
        DNSBlacklist: {
          Total: 439,
          Clean: 380,
          Marked: 45,
          Blacklisted: 14,
        },
      },
    ],
  },
]


// 扩展类型定义 - 服务器数据带元数据
export interface ServerWithMeta {
  id: string;           // 服务器唯一标识
  data: ServerData;     // 完整检测数据
  createdAt: string;    // 首次记录时间
  updatedAt: string;    // 最后更新时间
}

// API 请求体类型
export interface SubmitServerDataRequest {
  serverId: string;
  data: ServerData;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
}

// 成功提交响应
export interface SubmitSuccessResponse {
  success: true;
  id: string;
}

// 错误响应
export interface ErrorResponse {
  error: string;
  details?: string[];
}
