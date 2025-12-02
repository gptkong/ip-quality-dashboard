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

// Factor 数组项验证（CountryCode 也允许 null 值）
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

// Mail 数组项验证（所有邮件字段允许 null）
const MailItemSchema = z.object({
  Port25: z.boolean().nullable(),
  Gmail: z.boolean().nullable(),
  Outlook: z.boolean().nullable(),
  Yahoo: z.boolean().nullable(),
  Apple: z.boolean().nullable(),
  QQ: z.boolean().nullable(),
  MailRU: z.boolean().nullable(),
  AOL: z.boolean().nullable(),
  GMX: z.boolean().nullable(),
  MailCOM: z.boolean().nullable(),
  "163": z.boolean().nullable(),
  Sohu: z.boolean().nullable(),
  Sina: z.boolean().nullable(),
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
 * 字段名称中文映射
 */
const FIELD_NAME_MAP: Record<string, string> = {
  serverId: '服务器ID',
  data: '检测数据',
  Head: '头部信息',
  Info: '基础信息',
  Type: '类型信息',
  Score: '评分信息',
  Factor: '风险因子',
  Media: '流媒体解锁',
  Mail: '邮件检测',
  IP: 'IP地址',
  Command: '命令',
  GitHub: 'GitHub链接',
  Time: '时间',
  Version: '版本',
  ASN: 'ASN编号',
  Organization: '组织',
  Latitude: '纬度',
  Longitude: '经度',
  DMS: '度分秒坐标',
  Map: '地图链接',
  TimeZone: '时区',
  City: '城市',
  Region: '地区',
  Continent: '大洲',
  RegisteredRegion: '注册地区',
  Name: '名称',
  PostalCode: '邮编',
  SubCode: '子区域代码',
  Subdivisions: '行政区划',
  Code: '代码',
  Usage: '用途类型',
  Company: '公司类型',
  CountryCode: '国家代码',
  Proxy: '代理检测',
  Tor: 'Tor检测',
  VPN: 'VPN检测',
  Server: '服务器检测',
  Abuser: '滥用检测',
  Robot: '机器人检测',
  Status: '状态',
  DNSBlacklist: 'DNS黑名单',
  Total: '总数',
  Clean: '干净',
  Marked: '标记',
  Blacklisted: '黑名单',
  Port25: '端口25',
};

/**
 * 类型名称中文映射
 */
const TYPE_NAME_MAP: Record<string, string> = {
  string: '字符串',
  number: '数字',
  boolean: '布尔值',
  object: '对象',
  array: '数组',
  null: '空值',
  undefined: '未定义',
};

/**
 * 将路径转换为可读的中文描述
 */
function formatPath(path: (string | number)[]): string {
  if (path.length === 0) return '';
  
  const parts = path.map((p, index) => {
    if (typeof p === 'number') {
      return `第${p + 1}项`;
    }
    const chineseName = FIELD_NAME_MAP[p];
    if (chineseName) {
      return index === 0 ? chineseName : chineseName;
    }
    return p;
  });
  
  return parts.join(' → ');
}

/**
 * 翻译类型名称
 */
function translateType(type: string): string {
  return TYPE_NAME_MAP[type] || type;
}

/**
 * 格式化验证错误，提供更详细的信息
 */
function formatValidationError(err: z.ZodIssue): string {
  const path = formatPath(err.path);
  const code = err.code;
  
  let detail = '';
  
  // 根据错误类型提供更具体的信息
  switch (code) {
    case 'invalid_type': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issue = err as any;
      const expected = translateType(issue.expected);
      const received = translateType(issue.received);
      detail = `类型错误：期望 ${expected}，实际为 ${received}`;
      break;
    }
    case 'invalid_union':
      detail = '格式错误：数据不符合任何有效的数据结构';
      break;
    case 'too_small':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).type === 'array') {
        detail = '数组不能为空，至少需要1个元素';
      } else if ((err as any).type === 'string') {
        detail = '字符串不能为空';
      } else {
        detail = '值太小';
      }
      break;
    case 'too_big':
      detail = '值超出允许范围';
      break;
    case 'invalid_string':
      detail = '字符串格式无效';
      break;
    case 'invalid_literal':
      detail = `值必须为 ${JSON.stringify((err as z.ZodInvalidLiteralIssue).expected)}`;
      break;
    case 'unrecognized_keys':
      detail = `包含未知字段：${(err as z.ZodUnrecognizedKeysIssue).keys.join(', ')}`;
      break;
    case 'invalid_enum_value':
      detail = `无效的枚举值，允许的值：${(err as z.ZodInvalidEnumValueIssue).options.join(', ')}`;
      break;
    case 'custom':
      detail = err.message || '自定义验证失败';
      break;
    default:
      detail = err.message || '验证失败';
  }
  
  return path ? `【${path}】${detail}` : detail;
}

/**
 * 验证提交服务器数据的请求
 * @param data 待验证的请求数据
 * @returns 验证结果，包含详细的错误路径和类型信息
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
  
  // 提取详细错误信息
  const errors = result.error.errors.map(formatValidationError);
  
  // 去重并限制错误数量
  const uniqueErrors = [...new Set(errors)].slice(0, 10);
  
  return {
    success: false,
    errors: uniqueErrors,
  };
}
