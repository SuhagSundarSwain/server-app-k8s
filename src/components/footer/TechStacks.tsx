import { memo } from 'react'

function TechStacks({ items, version }: { items: string[]; version: string }) {
  return (
    <p className="text-slate-400 flex flex-wrap items-center justify-center gap-2">
      <span className="text-slate-200 font-semibold">{version}</span>
      <span className="text-slate-600">•</span>
      {items.map((name) => (
        <span
          key={name}
          className="px-2 py-1 rounded-full bg-slate-900/60 border border-slate-700 text-slate-300"
        >
          {name}
        </span>
      ))}
    </p>
  )
}

export default memo(TechStacks)
