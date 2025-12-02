import { z } from "zod";

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
  CountryCode: z.record(z.string(), z.string()),
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
  const result = ServerDataSchema.safeParse(data);
  
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

// API 请求体验证 Schema
export const SubmitServerDataRequestSchema = z.object({
  serverId: z.string().min(1, "serverId is required"),
  data: ServerDataSchema,
});

export type SubmitServerDataRequest = z.infer<typeof SubmitServerDataRequestSchema>;

/**
 * 验证提交服务器数据的请求
 * @param data 待验证的请求数据
 * @returns 验证结果
 */
export function validateSubmitRequest(data: unknown): ValidationResult<SubmitServerDataRequest> {
  const result = SubmitServerDataRequestSchema.safeParse(data);
  
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
