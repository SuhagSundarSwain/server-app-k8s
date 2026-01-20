import { Server } from 'lucide-react'

type Props = {
  title: string
  subtitle: string
}

export default function Header({ title, subtitle }: Props) {
  return (
    <header className="mb-10 flex items-center gap-5 border-b border-slate-800 pb-6">
      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl shadow-blue-600/25 ring-1 ring-white/10">
        <Server className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-slate-400 mt-2">{subtitle}</p>
      </div>
    </header>
  )
}
