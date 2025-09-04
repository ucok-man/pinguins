"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import FooterContent from "./footer-content";
import HeaderContent from "./header-content";
import MainContent from "./main-content";

export default function DashboardSidebar() {
  return (
    <SidebarContainer variant="inset">
      {/* Header */}
      <SidebarHeader>
        <HeaderContent />
      </SidebarHeader>

      <Separator />

      {/* Content */}
      <SidebarContent>
        <MainContent />
      </SidebarContent>

      <Separator />

      {/* Footer */}
      <SidebarFooter>
        <FooterContent />
      </SidebarFooter>
    </SidebarContainer>
  );
}
