import { Globe } from 'lucide-react'

export default function ClientFallbackCard({
  publicIp,
  localIps,
}: {
  publicIp: string | null
  localIps: string[]
}) {
  return (
    <div className="md:col-span-2 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 ring-1 ring-white/5">
      <div className="flex items-center gap-2 mb-4 text-orange-400">
        <Globe className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Client Perspective (Fallback)</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-slate-500 text-sm block mb-1">Public IP</span>
          <span className="font-mono text-lg text-orange-200 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20 inline-block ring-1 ring-white/5">
            {publicIp ?? 'Loading...'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-sm block mb-1">Local IPs (WebRTC)</span>
          <span className="font-mono text-sm text-slate-300 bg-slate-900/40 p-2 rounded block ring-1 ring-white/5">
            {localIps.length ? localIps.join(', ') : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  )
}
