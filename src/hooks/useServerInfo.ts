import { useEffect, useState } from 'react'
import type { ServerInfo } from '../types'
import { getLocalIps } from '../utils/network'

export function useServerInfo() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [fallbackLocalIps, setFallbackLocalIps] = useState<string[]>([])
  const [publicIp, setPublicIp] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    let mounted = true
    ;(async () => {
      try {
        const [infoRes] = await Promise.all([fetch('/api/info', { signal })])
        if (!infoRes.ok) throw new Error('api failed')
        const info = (await infoRes.json()) as ServerInfo
        if (mounted) setServerInfo(info)
      } catch {
        if (mounted) setError('Unable to reach server info. Showing fallback.')
      }
      try {
        const [ipRes, locals] = await Promise.all([
          fetch('https://api.ipify.org?format=json'),
          getLocalIps(),
        ])
        if (ipRes.ok) {
          const data = (await ipRes.json()) as { ip: string }
          if (mounted) setPublicIp(data.ip)
        }
        if (mounted) setFallbackLocalIps(locals)
      } catch {
        // ignore
      }
    })()
    return () => {
      mounted = false
      controller.abort()
    }
  }, [])

  return { serverInfo, fallbackLocalIps, publicIp, error }
}
