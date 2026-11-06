import { Link } from '@tanstack/react-router'
import { Command } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

export function TeamSwitcher() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Link
      to='/'
      className='flex items-center gap-3 px-2 py-1.5 text-sidebar-foreground hover:opacity-80 transition-all overflow-hidden'
    >
      <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
        <Command className='h-4 w-4' />
      </div>
      
      {!isCollapsed && (
        <div className='flex flex-col text-left text-sm leading-tight truncate'>
          <span className='truncate font-semibold'>GymStrike</span>
          <span className='truncate text-xs text-muted-foreground'>Panel de Control</span>
        </div>
      )}
    </Link>
  )
}