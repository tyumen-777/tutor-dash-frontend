import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "@/shared/model";
import { Home } from "@/pages/home";
import App from "./app.tsx";
import { Login } from "@/pages/login";
import { StudentAdd } from "@/pages/student-add";


export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: APP_ROUTES.HOME,
        element: <Home />,
      },
      {
        path: APP_ROUTES.STUDENTS,
        lazy: () => import("@/pages/students-page/ui/StudentsPage.tsx")
      },
      {
        path: APP_ROUTES.ADD_STUDENT,
        element: <StudentAdd />,
      },
      {
        path: APP_ROUTES.INCOMES,
        lazy: () => import("@/pages/incomes/ui/Incomes.tsx"),
      },
      {
        path: APP_ROUTES.STUDENT,
        lazy: () => import("@/pages/student-page/ui/StudentPage.tsx"),
      },
      {
        path: APP_ROUTES.TEACHERS,
        lazy: () => import("@/pages/teachers-page/ui/TeachersPage.tsx")
      },
    ],
  },
  { path: APP_ROUTES.LOGIN, element: <Login /> },
]);
