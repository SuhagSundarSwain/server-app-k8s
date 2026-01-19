import { useEffect, useState } from 'react'

type ServerInfo = {
  hostname: string
  primaryIpv4: string | null
  addresses: Array<{
    iface: string
    address: string
    family: string
    internal: boolean
  }>
  env: {
    HOSTNAME: string | null
    POD_NAME: string | null
    POD_IP: string | null
    NODE_NAME: string | null
  }
  time: string
}

function getLocalIps(): Promise<string[]> {
  const RTCPeer =
    (window as any).RTCPeerConnection ||
    (window as any).mozRTCPeerConnection ||
    (window as any).webkitRTCPeerConnection
  if (!RTCPeer) return Promise.resolve([])
  const ipSet = new Set<string>()
  return new Promise(async (resolve) => {
    const pc = new RTCPeer({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    pc.createDataChannel('x')
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      const candidate = event.candidate?.candidate
      if (!candidate) return
      const match = candidate.match(/(?:candidate:.+? )?([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-fA-F0-9:]+)/)
      const ip = match?.[1]
      if (!ip) return
      ipSet.add(ip)
    }
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    setTimeout(() => {
      pc.close()
      resolve(Array.from(ipSet))
    }, 1500)
  })
}

function App() {
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
      } catch (e) {
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

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Server Instance Info</h1>
      <div style={{ marginBottom: 12 }}>
        <strong>Hostname: </strong>
        <span>{serverInfo?.hostname ?? 'Loading...'}</span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Primary IPv4: </strong>
        <span>{serverInfo?.primaryIpv4 ?? 'Loading...'}</span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>All Addresses: </strong>
        <div>
          {serverInfo?.addresses?.length
            ? serverInfo.addresses
                .filter((a) => a.family === 'IPv4')
                .map((a) => `${a.iface}: ${a.address}`)
                .join(', ')
            : 'Loading...'}
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Env (K8s): </strong>
        <div>
          POD_NAME: {serverInfo?.env.POD_NAME ?? 'n/a'} | POD_IP:{' '}
          {serverInfo?.env.POD_IP ?? 'n/a'} | NODE_NAME:{' '}
          {serverInfo?.env.NODE_NAME ?? 'n/a'}
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 10, borderTop: '1px solid #444' }}>
        <strong>Fallback (Client): </strong>
        <div>Public IP: {publicIp ?? 'Loading...'}</div>
        <div>
          Local IPs: {fallbackLocalIps.length ? fallbackLocalIps.join(', ') : 'Unavailable'}
        </div>
      </div>
      {error && <div style={{ color: '#c00', marginTop: 12 }}>{error}</div>}
    </div>
  )
}

export default App
