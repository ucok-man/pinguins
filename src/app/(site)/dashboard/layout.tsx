import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import DashboardSidebar from "./_components/dashboard-sidebar";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="relative">
        <div className="size-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
