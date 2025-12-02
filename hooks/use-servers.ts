'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ServerWithMeta } from '@/lib/mock-data'

interface UseServersResult {
  servers: ServerWithMeta[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useServers(): UseServersResult {
  const [servers, setServers] = useState<ServerWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchServers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/servers')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch servers: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setServers(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServers()
  }, [fetchServers])

  return {
    servers,
    isLoading,
    error,
    refetch: fetchServers,
  }
}
