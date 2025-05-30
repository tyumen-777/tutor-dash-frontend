import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarRail,
} from "@/shared/ui/kit/sidebar";
import { UserPlus, Users, BanknoteArrowDown, Banknote } from "lucide-react";
import { APP_ROUTES } from "@/shared/routes.ts";
import NavGroup from "@/widgets/app-sidebar/ui/nav-group.tsx";
import { INavGroup } from "@/widgets/app-sidebar";

const navGroups: INavGroup[] = [
  {
    title: "Обучение",
    icon: Users,
    items: [
      {
        title: "Создать студента",
        icon: UserPlus,
        url: APP_ROUTES.ADD_STUDENT,
      },
      {
        title: "Студенты",
        icon: Users,
        url: APP_ROUTES.STUDENTS,
      },
    ],
  },
  {
    title: "Финансы",
    icon: Banknote,
    items: [
      {
        title: "Поступления",
        icon: BanknoteArrowDown,
        url: APP_ROUTES.INCOMES,
      },
    ],
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar className="top-[48px]" collapsible="icon">
      <SidebarContent>
        <SidebarMenu>
          <NavGroup items={navGroups} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
