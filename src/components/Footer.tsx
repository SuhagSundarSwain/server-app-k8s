import { User, Link as LinkIcon } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 text-center text-slate-400 text-sm pb-8 space-y-3">
      <p className="text-slate-500">Server Dashboard v1.0 • React + Tailwind</p>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <User className="w-4 h-4" />
          <span className="font-medium">Developer & Owner: Suhag Sundar Swain</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/SuhagSundarSwain"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20"
          >
            <LinkIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/suhagsundarswain/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20"
          >
            <LinkIcon className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
