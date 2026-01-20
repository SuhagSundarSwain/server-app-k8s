import { memo } from 'react'
import { Activity } from 'lucide-react'
import type { EnvInfo } from '../types'

function EnvK8sCard({ env }: { env: EnvInfo | undefined }) {
  return (
    <div className="group bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-slate-700 hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-4 text-purple-400">
        <Activity className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Environment (K8s)</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
          <span className="text-slate-400 text-sm">POD_NAME</span>
          <span className="font-mono text-sm text-slate-200 max-w-[180px] truncate" title={env?.POD_NAME ?? ''}>
            {env?.POD_NAME ?? 'n/a'}
          </span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
          <span className="text-slate-400 text-sm">POD_IP</span>
          <span className="font-mono text-sm text-slate-200">
            {env?.POD_IP ?? 'n/a'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">NODE_NAME</span>
          <span className="font-mono text-sm text-slate-200 max-w-[180px] truncate" title={env?.NODE_NAME ?? ''}>
            {env?.NODE_NAME ?? 'n/a'}
          </span>
        </div>
      </div>
    </div>
  )
}
export default memo(EnvK8sCard)
