import { useEffect, useState } from 'react'
import { Server, Globe, Network, Activity, AlertCircle, Monitor } from 'lucide-react'

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
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4 border-b border-slate-700 pb-6">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Server className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Server Instance Info
            </h1>
            <p className="text-slate-400 mt-1">Real-time system diagnostics</p>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Info Card */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-slate-600">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Monitor className="w-5 h-5" />
              <h2 className="text-lg font-semibold">System Identity</h2>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-slate-500 text-sm block mb-1">Hostname</span>
                <span className="text-xl font-mono bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/50 block w-full truncate" title={serverInfo?.hostname}>
                  {serverInfo?.hostname ?? 'Loading...'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-sm block mb-1">Primary IPv4</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20">
                    {serverInfo?.primaryIpv4 ?? 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kubernetes Environment */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-slate-600">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Environment (K8s)</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                <span className="text-slate-400 text-sm">POD_NAME</span>
                <span className="font-mono text-sm text-slate-200 max-w-[180px] truncate" title={serverInfo?.env.POD_NAME ?? ''}>
                  {serverInfo?.env.POD_NAME ?? 'n/a'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                <span className="text-slate-400 text-sm">POD_IP</span>
                <span className="font-mono text-sm text-slate-200">
                  {serverInfo?.env.POD_IP ?? 'n/a'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">NODE_NAME</span>
                <span className="font-mono text-sm text-slate-200 max-w-[180px] truncate" title={serverInfo?.env.NODE_NAME ?? ''}>
                  {serverInfo?.env.NODE_NAME ?? 'n/a'}
                </span>
              </div>
            </div>
          </div>

          {/* Network Interfaces */}
          <div className="md:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-slate-600">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Network className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Network Interfaces</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {serverInfo?.addresses?.length ? (
                serverInfo.addresses
                  .filter((a) => a.family === 'IPv4')
                  .map((a, i) => (
                    <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col transition-colors hover:bg-slate-900">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{a.iface}</span>
                      <span className="font-mono text-slate-200">{a.address}</span>
                    </div>
                  ))
              ) : (
                <div className="text-slate-500 italic">Loading network interfaces...</div>
              )}
            </div>
          </div>

          {/* Client Fallback */}
          <div className="md:col-span-2 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-orange-400">
              <Globe className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Client Perspective (Fallback)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-slate-500 text-sm block mb-1">Public IP</span>
                <span className="font-mono text-lg text-orange-200 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20 inline-block">
                  {publicIp ?? 'Loading...'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-sm block mb-1">Local IPs (WebRTC)</span>
                <span className="font-mono text-sm text-slate-400 bg-slate-900/30 p-2 rounded block">
                  {fallbackLocalIps.length ? fallbackLocalIps.join(', ') : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-600 text-sm pb-8">
          <p>Server Dashboard v1.0 • Powered by React & Tailwind</p>
        </footer>
      </div>
    </div>
  )
}

export default App
