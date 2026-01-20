import { memo } from 'react'
import { Server, Github } from 'lucide-react'

type Props = {
  title: string
  subtitle: string
}

function Header({ title, subtitle }: Props) {
  return (
    <header className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
      <div className="flex items-center gap-5">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl shadow-blue-600/25 ring-1 ring-white/10">
          <Server className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-slate-400 mt-2">{subtitle}</p>
        </div>
      </div>
      <a
        href="https://github.com/SuhagSundarSwain/server-app-k8s"
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 ring-1 ring-white/10 hover:border-blue-500/40 hover:bg-slate-900/80 transition-colors"
        title="Open project repository"
      >
        <div className="relative">
          <span className="absolute -inset-2 rounded-full bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          <Github className="w-5 h-5 text-slate-300 group-hover:text-blue-300 transition-colors" />
        </div>
        <span className="text-slate-300 group-hover:text-blue-200 transition-colors">
          View Repo
        </span>
      </a>
    </header>
  )
}
export default memo(Header)
