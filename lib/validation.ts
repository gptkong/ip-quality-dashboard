import { z } from "zod";

/**
 * 移除字符串中的 ANSI 转义序列（shell 颜色代码）
 * 例如: "\u001b[31mCN\u001b[32m" -> "CN"
 */
function stripAnsiCodes(str: string): string {
  // 匹配 ANSI 转义序列：\u001b[Xm 或 \x1b[Xm 格式
  // 也处理不完整的格式如 \u001b31m（缺少 [）
  return str.replace(/\u001b\[?\d*m|\x1b\[?\d*m/g, '');
}

/**
 * 递归清理对象中所有字符串的 ANSI 转义序列
 */
function sanitizeAnsiCodes<T>(data: T): T {
  if (typeof data === 'string') {
    return stripAnsiCodes(data) as T;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeAnsiCodes(item)) as T;
  }
  
  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = sanitizeAnsiCodes(value);
    }
    return result as T;
  }
  
  return data;
}

// Head 数组项验证
const HeadItemSchema = z.object({
  IP: z.string(),
  Command: z.string(),
  GitHub: z.string(),
  Time: z.string(),
  Version: z.string(),
});

// City 对象验证
const CitySchema = z.object({
  Name: z.string(),
  PostalCode: z.string(),
  SubCode: z.string(),
  Subdivisions: z.string(),
});

// Region 对象验证
const RegionSchema = z.object({
  Code: z.string(),
  Name: z.string(),
});

// Info 数组项验证
const InfoItemSchema = z.object({
  ASN: z.string(),
  Organization: z.string(),
  Latitude: z.string(),
  Longitude: z.string(),
  DMS: z.string(),
  Map: z.string(),
  TimeZone: z.string(),
  City: CitySchema,
  Region: RegionSchema,
  Continent: RegionSchema,
  RegisteredRegion: RegionSchema,
  Type: z.string(),
});

// Type 数组项验证
const TypeItemSchema = z.object({
  Usage: z.record(z.string(), z.string()),
  Company: z.record(z.string(), z.string()),
});

// Score 数组项验证
const ScoreItemSchema = z.record(z.string(), z.string());

// Factor 数组项验证
const FactorItemSchema = z.object({
  CountryCode: z.record(z.string(), z.string().nullable()),
  Proxy: z.record(z.string(), z.boolean().nullable()),
  Tor: z.record(z.string(), z.boolean().nullable()),
  VPN: z.record(z.string(), z.boolean().nullable()),
  Server: z.record(z.string(), z.boolean().nullable()),
  Abuser: z.record(z.string(), z.boolean().nullable()),
  Robot: z.record(z.string(), z.boolean().nullable()),
});


// Media 状态对象验证
const MediaStatusSchema = z.object({
  Status: z.string(),
  Region: z.string(),
  Type: z.string(),
});

// Media 数组项验证
const MediaItemSchema = z.record(z.string(), MediaStatusSchema);

// DNSBlacklist 对象验证
const DNSBlacklistSchema = z.object({
  Total: z.number(),
  Clean: z.number(),
  Marked: z.number(),
  Blacklisted: z.number(),
});

// Mail 数组项验证
const MailItemSchema = z.object({
  Port25: z.boolean(),
  Gmail: z.boolean(),
  Outlook: z.boolean(),
  Yahoo: z.boolean(),
  Apple: z.boolean(),
  QQ: z.boolean(),
  MailRU: z.boolean(),
  AOL: z.boolean(),
  GMX: z.boolean(),
  MailCOM: z.boolean(),
  "163": z.boolean(),
  Sohu: z.boolean(),
  Sina: z.boolean(),
  DNSBlacklist: DNSBlacklistSchema,
});

// 完整的 ServerData 验证 Schema
export const ServerDataSchema = z.object({
  Head: z.array(HeadItemSchema).min(1),
  Info: z.array(InfoItemSchema).min(1),
  Type: z.array(TypeItemSchema).min(1),
  Score: z.array(ScoreItemSchema).min(1),
  Factor: z.array(FactorItemSchema).min(1),
  Media: z.array(MediaItemSchema).min(1),
  Mail: z.array(MailItemSchema).min(1),
});

// 验证结果类型
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// 从 Schema 推断类型
export type ValidatedServerData = z.infer<typeof ServerDataSchema>;

/**
 * 验证服务器检测数据
 * @param data 待验证的数据
 * @returns 验证结果，包含成功标志、验证后的数据或错误信息
 */
export function validateServerData(data: unknown): ValidationResult<ValidatedServerData> {
  // 先清理 ANSI 转义序列
  const sanitizedData = sanitizeAnsiCodes(data);
  const result = ServerDataSchema.safeParse(sanitizedData);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }
  
  // 提取错误信息
  const errors = result.error.errors.map((err) => {
    const path = err.path.join(".");
    return path ? `${path}: ${err.message}` : err.message;
  });
  
  return {
    success: false,
    errors,
  };
}

// 单个 IP 检测结果或多个（双栈）
export const ServerDataArraySchema = z.union([
  z.array(ServerDataSchema).min(1),    // 双栈：对象数组（优先匹配）
  ServerDataSchema,                    // 单栈：单个对象
]);

// API 请求体验证 Schema
export const SubmitServerDataRequestSchema = z.object({
  serverId: z.string().min(1, "serverId is required"),
  data: ServerDataArraySchema,
});

export type SubmitServerDataRequest = z.infer<typeof SubmitServerDataRequestSchema>;

/**
 * 标准化服务器数据为数组格式
 * @param data 单个或多个检测结果
 * @returns 统一的数组格式
 */
export function normalizeServerData(data: ValidatedServerData | ValidatedServerData[]): ValidatedServerData[] {
  return Array.isArray(data) && !('Head' in data) ? data : [data as ValidatedServerData];
}

/**
 * 验证提交服务器数据的请求
 * @param data 待验证的请求数据
 * @returns 验证结果
 */
export function validateSubmitRequest(data: unknown): ValidationResult<SubmitServerDataRequest> {
  // 先清理 ANSI 转义序列
  const sanitizedData = sanitizeAnsiCodes(data);
  const result = SubmitServerDataRequestSchema.safeParse(sanitizedData);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }
  
  const errors = result.error.errors.map((err) => {
    const path = err.path.join(".");
    return path ? `${path}: ${err.message}` : err.message;
  });
  
  return {
    success: false,
    errors,
  };
}
