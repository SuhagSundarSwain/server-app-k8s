import { memo } from 'react'
import { Github, Linkedin } from 'lucide-react'

type LinkItem = {
  label: string
  href: string
  icon: 'github' | 'linkedin'
}

const IconMap = {
  github: Github,
  linkedin: Linkedin,
}

function SocialLinks({ links }: { links: LinkItem[] }) {
  return (
    <div className="flex items-center gap-4">
      {links.map((link) => {
        const Icon = IconMap[link.icon]
        return (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20"
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
          </a>
        )
      })}
    </div>
  )
}

export default memo(SocialLinks)
