import { useEffect, useState } from 'react'
import type { ServerInfo } from '../types'
import { getLocalIps } from '../utils/network'

export function useServerInfo() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [fallbackLocalIps, setFallbackLocalIps] = useState<string[]>([])
  const [publicIp, setPublicIp] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/info')
        if (res.ok) {
          const info = (await res.json()) as ServerInfo
          if (!cancelled) setServerInfo(info)
        } else {
          throw new Error('api failed')
        }
      } catch {
        if (!cancelled) setError('Unable to reach server info. Showing fallback.')
      }
      try {
        const res = await fetch('https://api.ipify.org?format=json')
        const data = (await res.json()) as { ip: string }
        if (!cancelled) setPublicIp(data.ip)
      } catch {}
      const locals = await getLocalIps()
      if (!cancelled) setFallbackLocalIps(locals)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { serverInfo, fallbackLocalIps, publicIp, error }
}
