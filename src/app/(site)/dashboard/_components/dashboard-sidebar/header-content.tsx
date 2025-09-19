"use client";

import { Logo } from "@/components/logo";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export default function HeaderContent() {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <button
          onClick={() => {
            if (isMobile) {
              toggleSidebar();
            }
          }}
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Logo href="/" className="text-lg" />
        </button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
