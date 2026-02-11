import { PendingInvitesModal } from '@/components/PendingInvitesModal'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { useNotificationModal } from '@/modules/workspace/store/notification-modal.store'

import { useSidebarData } from './hooks/useSidebarData'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const sidebarData = useSidebarData()
  const { isOpen, setIsOpen } = useNotificationModal()

  return (
    <>
      <Sidebar collapsible={collapsible} variant={variant}>
        <SidebarHeader>
          <TeamSwitcher teams={sidebarData.teams} />
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <PendingInvitesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
