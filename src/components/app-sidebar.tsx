// src/components/app-sidebar.tsx

import * as React from "react";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { sidebarMenu } from "./sidebar/sidebar";
import logoSima from "@/assets/logo_sima2.png"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="inset" className="bg-white text-slate-800 border-r border-slate-200">
      <SidebarHeader className="bg-slate-50 border-b border-slate-200 group-data-[collapsible=icon]:justify-center">
        <TeamSwitcher teams={[{ name: "SIMA", logo: logoSima, plan: "" }]} />
      </SidebarHeader >
      <SidebarContent className="bg-white">
        <NavMain items={sidebarMenu} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}