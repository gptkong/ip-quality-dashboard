// 平台解锁状态类型
export interface PlatformStatus {
  name: string;
  status: "YES" | "NO" | "Banned" | "Unknown";
  region?: string;
  type?: string; // Native, Via DNS 等
  note?: string; // 额外说明
}

export interface PlatformUnlockData {
  ipv4Asn?: string;
  ipv4Location?: string;
  ipv6Asn?: string;
  ipv6Location?: string;
  platforms: PlatformStatus[]; // IPV4 平台数据
  ipv6Platforms?: PlatformStatus[]; // IPV6 平台数据
  testTime?: string;
  duration?: string;
}

/**
 * 移除 ANSI 颜色控制码
 */
function stripAnsiCodes(text: string): string {
  // 匹配 ANSI 转义序列: ESC[ ... m 或 \[数字m 格式
  return text.replace(/\x1b\[[0-9;]*m|\[\d+m/g, '');
}

/**
 * 解析 goecs 测试结果文本
 */
export function parseGoecsResult(content: string): PlatformUnlockData {
  // 先清理 ANSI 颜色码
  const cleanContent = stripAnsiCodes(content);
  const lines = cleanContent.split('\n');
  const result: PlatformUnlockData = {
    platforms: [],
  };

  let inPlatformSection = false;
  let currentIpVersion: 'ipv4' | 'ipv6' = 'ipv4';

  for (const line of lines) {
    const trimmed = line.trim();

    // 解析 IP 信息
    if (trimmed.startsWith('IPV4 ASN')) {
      result.ipv4Asn = trimmed.split(':').slice(1).join(':').trim();
    } else if (trimmed.startsWith('IPV4 Location')) {
      result.ipv4Location = trimmed.split(':').slice(1).join(':').trim();
    } else if (trimmed.startsWith('IPV6 ASN')) {
      result.ipv6Asn = trimmed.split(':').slice(1).join(':').trim();
    } else if (trimmed.startsWith('IPV6 Location')) {
      result.ipv6Location = trimmed.split(':').slice(1).join(':').trim();
    }

    // 检测 IPV4/IPV6 区块标记
    if (trimmed === 'IPV4:' || trimmed.match(/^IPV4\s*[:：]?\s*$/i)) {
      currentIpVersion = 'ipv4';
      continue;
    }
    if (trimmed === 'IPV6:' || trimmed.match(/^IPV6\s*[:：]?\s*$/i)) {
      currentIpVersion = 'ipv6';
      if (!result.ipv6Platforms) {
        result.ipv6Platforms = [];
      }
      continue;
    }

    // 检测平台区块开始
    if (trimmed.includes('跨国平台')) {
      inPlatformSection = true;
      continue;
    }

    // 检测区块结束（遇到分隔线）
    if (trimmed.startsWith('---') && inPlatformSection) {
      inPlatformSection = false;
      continue;
    }

    // 解析平台状态
    if (inPlatformSection && trimmed && !trimmed.startsWith('=')) {
      const platform = parsePlatformLine(trimmed);
      if (platform) {
        if (currentIpVersion === 'ipv6') {
          if (!result.ipv6Platforms) {
            result.ipv6Platforms = [];
          }
          result.ipv6Platforms.push(platform);
        } else {
          result.platforms.push(platform);
        }
      }
    }

    // 解析时间信息
    if (trimmed.startsWith('时间')) {
      result.testTime = trimmed.split(':').slice(1).join(':').trim();
    } else if (trimmed.startsWith('花费')) {
      result.duration = trimmed.split(':').slice(1).join(':').trim();
    }
  }

  return result;
}

/**
 * 解析单行平台状态
 */
function parsePlatformLine(line: string): PlatformStatus | null {
  // 匹配格式: PlatformName    STATUS (details) [type]
  const match = line.match(/^(\S+(?:\s+\S+)*?)\s{2,}(YES|NO|Banned)(.*)$/i);
  if (!match) return null;

  const [, name, statusRaw, rest] = match;
  const upperStatus = statusRaw.toUpperCase();
  const status = (upperStatus === 'BANNED' ? 'Banned' : upperStatus) as "YES" | "NO" | "Banned";

  const result: PlatformStatus = {
    name: name.trim(),
    status,
  };

  // 解析 Region
  const regionMatch = rest.match(/\(Region:\s*([^)]+)\)/i);
  if (regionMatch) {
    result.region = regionMatch[1].trim();
  }

  // 解析其他括号内容作为 note
  const noteMatch = rest.match(/\(([^)]+)\)/g);
  if (noteMatch) {
    const notes = noteMatch
      .map(n => n.slice(1, -1))
      .filter(n => !n.toLowerCase().startsWith('region:'));
    if (notes.length > 0) {
      result.note = notes.join(', ');
    }
  }

  // 解析 Type [Native], [Via DNS] 等
  const typeMatch = rest.match(/\[([^\]]+)\]/);
  if (typeMatch) {
    result.type = typeMatch[1].trim();
  }

  return result;
}

/**
 * 将平台状态转换为存储格式
 */
export function platformsToJson(platforms: PlatformStatus[]): string {
  return JSON.stringify(platforms);
}

/**
 * 从 JSON 恢复平台状态
 */
export function platformsFromJson(json: string): PlatformStatus[] {
  try {
    return JSON.parse(json) as PlatformStatus[];
  } catch {
    return [];
  }
}
