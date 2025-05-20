
import { ReactNode } from 'react';

export type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
  description?: string;
  isAction?: boolean;
  alwaysAccessible?: boolean;
  subItems?: NavItem[];
}
