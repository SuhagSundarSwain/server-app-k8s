import { memo } from 'react'
import { Monitor } from 'lucide-react'
import type { ServerInfo } from '../types'

function SystemIdentityCard({ info }: { info: ServerInfo | null }) {
  return (
    <div className="group bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-slate-700 hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-4 text-blue-400">
        <Monitor className="w-5 h-5" />
        <h2 className="text-lg font-semibold">System Identity</h2>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-slate-500 text-sm block mb-1">Hostname</span>
          <span className="text-xl font-mono bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50 block w-full truncate ring-1 ring-white/5" title={info?.hostname}>
            {info?.hostname ?? 'Loading...'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-sm block mb-1">Primary IPv4</span>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-lg font-mono text-emerald-300 bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20 ring-1 ring-white/5 animate-pulse">
              {info?.primaryIpv4 ?? 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default memo(SystemIdentityCard)
