import { LinkProps } from "react-router-dom";
import * as React from "react";

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

type NavLink = BaseNavItem & {
  url: LinkProps["to"];
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps["to"] })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface INavGroup {
  title: string;
  icon?: React.ElementType;
  items: NavItem[];
}

export type { INavGroup };
