import {
  Table,
  FolderArchive,
  BookOpen,
  FileText,
  Calendar,
  Home,
} from "lucide-react";

export const lucideIcons = {
  Table,
  FolderArchive,
  BookOpen,
  FileText,
  Calendar,
  Home,
};

export const iconOptions = Object.entries(lucideIcons).map(([name, Icon]) => ({
  label: name,
  value: name,
  icon: Icon,
}));
