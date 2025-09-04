import { Logo } from "@/components/logo";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export default function HeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <button className="data-[slot=sidebar-menu-button]:!p-1.5">
          <Logo href="/" className="text-lg" />
        </button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
