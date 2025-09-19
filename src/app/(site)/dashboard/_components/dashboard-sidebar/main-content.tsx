"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { SIDEBAR_ITEMS } from "./sidebar-items";

export default function MainContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <div>
      {SIDEBAR_ITEMS.map((group, idx) => (
        <SidebarGroup key={idx}>
          <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item, idx) => (
                <SidebarMenuItem key={idx}>
                  <SidebarMenuButton
                    onClick={() => {
                      if (isMobile) {
                        toggleSidebar();
                      }
                      router.push(item.href);
                    }}
                    isActive={pathname === item.href}
                    className={cn(
                      "cursor-pointer data-[active=true]:bg-brand-primary-600 data-[active=true]:text-brand-secondary-50 text-brand-secondary-700"
                    )}
                    tooltip={item.text}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.text}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
