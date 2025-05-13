import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/kit/sidebar";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/shared/routes.ts";

const items = [
  {
    title: "Главная",
    icon: Home,
    url: APP_ROUTES.HOME,
  },
  {
    title: "Login",
    icon: Home,
    url: APP_ROUTES.LOGIN,
  },
];
export const AppSidebar = () => {
  return (
    <Sidebar className="top-[48px]" collapsible="icon">
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
