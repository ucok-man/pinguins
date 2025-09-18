import { Gem, Home, Key, LayoutGrid, Settings2 } from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    category: "Overview",
    items: [
      {
        href: "/dashboard",
        icon: Home,
        text: "Dashboard",
      },
      {
        href: "/dashboard/quickstart",
        icon: LayoutGrid,
        text: "Quick Start",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        href: "/dashboard/upgrade",
        icon: Gem,
        text: "Upgrade",
      },
    ],
  },
  {
    category: "Settings",
    items: [
      {
        href: "/dashboard/api-key",
        icon: Key,
        text: "API Key",
      },
      {
        href: "/dashboard/integrations",
        icon: Settings2,
        text: "Integrations",
      },
    ],
  },
];
