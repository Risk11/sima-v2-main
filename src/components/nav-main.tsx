"use client"

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";


type NavItem = {
  title: string;
  icon?: LucideIcon;
  url?: string;
  items?: NavSubItem[];
};

type NavSubItem = {
  title: string;
  url: string;
};

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const { state } = useSidebar();

  const isParentActive = (item: NavItem) => {
    if (!item.items) return false;
    return item.items.some(subItem => location.pathname.startsWith(subItem.url));
  };

  return (
    <SidebarGroup className="p-3">
      <SidebarMenu className="gap-2">
        {items.map((item) =>
          item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive(item)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={state === 'collapsed' ? { content: item.title } : undefined}
                    isActive={isParentActive(item)}
                    className={
                      `group relative transition-colors duration-200 
                       ${isParentActive(item)
                        ? 'bg-blue-200 text-blue-800'
                        : 'text-slate-700 hover:bg-blue-200 hover:text-blue-800'
                      }`
                    }
                  >
                    {isParentActive(item) && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-blue-600" />}

                    {item.icon && <item.icon size={18} className={`${isParentActive(item) ? 'text-blue-600' : 'text-blue-500'} transition-colors group-hover:text-blue-600`} />}
                    <span className="transition-colors group-hover:text-blue-800 group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <ChevronRight className="ml-auto text-blue-400 transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 group-hover:text-blue-500 group-data-[collapsible=icon]:hidden" size={16} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname.startsWith(subItem.url)}
                          className="group/sub"
                        >
                          <Link to={subItem.url}>
                            <span className={`w-2 h-0.5 rounded-full transition-all duration-300 ${location.pathname.startsWith(subItem.url) ? 'bg-blue-600 scale-x-150' : 'bg-blue-300 group-hover/sub:bg-blue-500'}`} />
                            <span className="text-slate-700 group-hover/sub:text-blue-800">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                tooltip={state === 'collapsed' ? { content: item.title } : undefined}
                className={
                  `group relative transition-colors duration-200 
                   ${location.pathname === item.url
                    ? 'bg-blue-200 text-blue-800'
                    : 'text-slate-700 hover:bg-blue-200 hover:text-blue-800'
                  }`
                }
              >
                <Link to={item.url!}>
                  {location.pathname === item.url && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-blue-600" />}

                  {item.icon && <item.icon size={18} className={`${location.pathname === item.url ? 'text-blue-600' : 'text-blue-500'} transition-colors group-hover:text-blue-600`} />}
                  <span className="transition-colors group-hover:text-blue-800 group-data-[collapsible=icon]:hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}