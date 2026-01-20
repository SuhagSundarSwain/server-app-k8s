import { memo, useMemo } from 'react'
import TechStacks from './footer/TechStacks'
import DeveloperInfo from './footer/DeveloperInfo'
import SocialLinks from './footer/SocialLinks'

function Footer() {
  const stacks = useMemo(
    () => [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Lucide Icons',
      'Express',
      'Node.js',
      'Docker',
      'Kubernetes',
      'Git',
    ],
    []
  )
  const links = useMemo(
    () => [
      { label: 'GitHub', href: 'https://github.com/SuhagSundarSwain', icon: 'github' as const },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suhagsundarswain/', icon: 'linkedin' as const },
    ],
    []
  )
  return (
    <footer className="mt-12 text-center text-slate-400 text-sm pb-8 space-y-3">
      <TechStacks items={stacks} version="Server Dashboard v1.4.1" />
      <div className="flex flex-col items-center gap-2">
        <DeveloperInfo name="Suhag Sundar Swain" />
        <SocialLinks links={links} />
      </div>
    </footer>
  )
}
export default memo(Footer)
