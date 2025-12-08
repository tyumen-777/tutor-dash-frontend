import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "../shared/routes.ts";
import { Home } from "@/pages/home";
import App from "./app.tsx";
import { Login } from "@/pages/login";
import { StudentAdd } from "@/pages/student-add";
import { Students } from "@/pages/students";
import { Incomes } from "@/pages/incomes";
import { Student } from "@/pages/student";
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
        element: <Students />,
      },
      {
        path: APP_ROUTES.ADD_STUDENT,
        element: <StudentAdd />,
      },
      {
        path: APP_ROUTES.INCOMES,
        element: <Incomes />,
      },
      {
        path: APP_ROUTES.STUDENT,
        element: <Student />,
      },
    ],
  },
  { path: APP_ROUTES.LOGIN, element: <Login /> },
]);
