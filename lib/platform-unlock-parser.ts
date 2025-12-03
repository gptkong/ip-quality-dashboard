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
  platforms: PlatformStatus[];
  testTime?: string;
  duration?: string;
}

/**
 * 解析 goecs 测试结果文本
 */
export function parseGoecsResult(content: string): PlatformUnlockData {
  const lines = content.split('\n');
  const result: PlatformUnlockData = {
    platforms: [],
  };

  let inPlatformSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // 解析 IP 信息
    if (trimmed.startsWith('IPV4 ASN')) {
      result.ipv4Asn = trimmed.split(':').slice(1).join(':').trim();
    } else if (trimmed.startsWith('IPV4 Location')) {
      result.ipv4Location = trimmed.split(':').slice(1).join(':').trim();
    }

    // 检测平台区块开始
    if (trimmed.includes('跨国平台')) {
      inPlatformSection = true;
      continue;
    }

    // 检测区块结束
    if (trimmed.startsWith('---') && inPlatformSection) {
      inPlatformSection = false;
      continue;
    }

    // 解析平台状态
    if (inPlatformSection && trimmed && !trimmed.startsWith('=')) {
      const platform = parsePlatformLine(trimmed);
      if (platform) {
        result.platforms.push(platform);
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
  const status = statusRaw.toUpperCase() as "YES" | "NO" | "Banned";

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
