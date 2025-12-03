"use client";

import { useState, useEffect, useCallback } from "react";
import type { PlatformStatus } from "@/lib/platform-unlock-parser";

export interface PlatformUnlockData {
  id: number;
  serverId: string;
  ipv4Asn: string | null;
  ipv4Location: string | null;
  platforms: PlatformStatus[];
  rawContent: string | null;
  testTime: string | null;
  createdAt: string;
}

interface UsePlatformUnlockResult {
  data: PlatformUnlockData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePlatformUnlock(serverId: string | null): UsePlatformUnlockResult {
  const [data, setData] = useState<PlatformUnlockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!serverId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/servers/${serverId}/platform-unlock`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else if (response.status === 404) {
        setData(null);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error");
      console.error("Failed to fetch platform unlock data:", err);
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
