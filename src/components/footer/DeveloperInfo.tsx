import { memo } from 'react'
import { User } from 'lucide-react'

function DeveloperInfo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <User className="w-4 h-4" />
      <span className="font-medium">Developer & Owner: {name}</span>
    </div>
  )
}

export default memo(DeveloperInfo)
