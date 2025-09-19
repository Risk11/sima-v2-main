import { LucideIcon } from "lucide-react";

export type NavItem =
  | {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: never;
    }
  | {
      title: string;
      icon?: LucideIcon;
      isActive?: boolean;
      url?: never;
      items: { title: string; url: string }[];
    };
    
export interface NavGroup {
  title: string;
  items: NavItem[];
}