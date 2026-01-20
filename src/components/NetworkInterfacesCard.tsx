import { Network } from 'lucide-react'
import type { NetAddress } from '../types'

export default function NetworkInterfacesCard({ addresses }: { addresses: NetAddress[] | undefined }) {
  return (
    <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-slate-700">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <Network className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Network Interfaces</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {addresses?.length ? (
          addresses
            .filter((a) => a.family === 'IPv4')
            .map((a, i) => (
              <div key={i} className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 ring-1 ring-white/5 flex flex-col transition-all hover:bg-slate-900 hover:-translate-y-0.5">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{a.iface}</span>
                <span className="font-mono text-slate-200">{a.address}</span>
              </div>
            ))
        ) : (
          <div className="text-slate-500 italic">Loading network interfaces...</div>
        )}
      </div>
    </div>
  )
}
