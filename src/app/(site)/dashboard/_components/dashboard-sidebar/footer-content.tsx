"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useClerk, useUser } from "@clerk/nextjs";
import { ChevronsUpDown, LogOut, User } from "lucide-react";

export default function FooterContent() {
  const { isMobile } = useSidebar();
  const clerk = useClerk();
  const { user } = useUser();

  const handleSignOut = async () => {
    await clerk.signOut();
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default" disabled>
          <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <div className="h-4 bg-muted rounded animate-pulse mb-1" />
            <div className="h-3 bg-muted/70 rounded animate-pulse w-3/4" />
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/50" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );

  // Show loading skeleton while user data is loading
  if (!user) {
    return <LoadingSkeleton />;
  }

  // Get user initials for fallback
  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200 ease-in-out"
            >
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-transparent group-hover:ring-sidebar-accent/20 transition-all duration-200">
                <AvatarImage
                  src={user.imageUrl}
                  alt={`${user.fullName}`}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0 font-medium">
                <span className="truncate text-sidebar-foreground group-hover:text-sidebar-accent-foreground transition-colors">
                  {user?.fullName}
                </span>
                <span className="text-muted-foreground truncate text-xs opacity-70 group-hover:opacity-90 transition-opacity">
                  {user.emailAddresses.at(0)?.emailAddress || "No email"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-hover:text-sidebar-accent-foreground transition-all duration-200 group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Content */}
          <DropdownMenuContent
            className="min-w-64 rounded-xl animate-in slide-in-from-bottom-2 duration-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left border-b border-border/30">
                <Avatar className="h-10 w-10 rounded-xl ring-2 ring-border/20">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={`${user.fullName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-xl text-sm">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight min-w-0 font-medium">
                  <span className="truncate text-foreground text-sm">
                    {user.fullName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs mt-0.5">
                    {user.emailAddresses.at(0)?.emailAddress || "No email"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <div>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-accent/10 focus:bg-accent transition-all duration-150 text-brand-secondary-700"
                  onClick={() => clerk.openUserProfile()}
                >
                  <User className="size-4 text-muted-foreground transition-colors" />
                  <span className="text-sm transition-colors">Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-brand-secondary-700"
              >
                <LogOut className="size-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                <span className="text-sm group-hover:text-destructive transition-colors">
                  Sign out
                </span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
