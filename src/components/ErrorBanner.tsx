import { memo } from 'react'
import { AlertCircle } from 'lucide-react'

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="mb-6 bg-gradient-to-br from-red-500/15 to-red-500/5 border border-red-500/40 text-red-300 p-4 rounded-xl flex items-center gap-3 shadow-lg shadow-red-900/20">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
export default memo(ErrorBanner)
