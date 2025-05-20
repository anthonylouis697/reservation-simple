
import { ReactNode } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  description?: string;
  subItems?: NavItem[];
  isAction?: boolean;
  alwaysAccessible?: boolean;
}
