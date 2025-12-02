export interface ServerData {
  Head: Array<{
    IP: string;
    Command: string;
    GitHub: string;
    Time: string;
    Version: string;
  }>;
  Info: Array<{
    ASN: string;
    Organization: string;
    Latitude: string;
    Longitude: string;
    DMS: string;
    Map: string;
    TimeZone: string;
    City: {
      Name: string;
      PostalCode: string;
      SubCode: string;
      Subdivisions: string;
    };
    Region: {
      Code: string;
      Name: string;
    };
    Continent: {
      Code: string;
      Name: string;
    };
    RegisteredRegion: {
      Code: string;
      Name: string;
    };
    Type: string;
  }>;
  Type: Array<{
    Usage: Record<string, string>;
    Company: Record<string, string>;
  }>;
  Score: Array<Record<string, string>>;
  Factor: Array<{
    CountryCode: Record<string, string | null>;
    Proxy: Record<string, boolean | null>;
    Tor: Record<string, boolean | null>;
    VPN: Record<string, boolean | null>;
    Server: Record<string, boolean | null>;
    Abuser: Record<string, boolean | null>;
    Robot: Record<string, boolean | null>;
  }>;
  Media: Array<
    Record<
      string,
      {
        Status: string;
        Region: string;
        Type: string;
      }
    >
  >;
  Mail: Array<{
    Port25: boolean | null;
    Gmail: boolean | null;
    Outlook: boolean | null;
    Yahoo: boolean | null;
    Apple: boolean | null;
    QQ: boolean | null;
    MailRU: boolean | null;
    AOL: boolean | null;
    GMX: boolean | null;
    MailCOM: boolean | null;
    "163": boolean | null;
    Sohu: boolean | null;
    Sina: boolean | null;
    DNSBlacklist: {
      Total: number;
      Clean: number;
      Marked: number;
      Blacklisted: number;
    };
  }>;
}

// 双栈数据类型：单个或多个检测结果
export type ServerDataOrArray = ServerData | ServerData[];

// 扩展类型定义 - 服务器数据带元数据
export interface ServerWithMeta {
  id: string; // 服务器唯一标识
  data: ServerDataOrArray; // 完整检测数据（支持双栈）
  createdAt: string; // 首次记录时间
  updatedAt: string; // 最后更新时间
}

// API 请求体类型
export interface SubmitServerDataRequest {
  serverId: string;
  data: ServerDataOrArray; // 支持双栈
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
