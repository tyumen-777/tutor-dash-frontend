import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "../shared/routes.ts";
import { Home } from "@/pages/home";
import App from "./app.tsx";
import { Login } from "@/pages/login";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: APP_ROUTES.HOME,
        element: <Home />,
      },
    ],
  },
  { path: APP_ROUTES.LOGIN, element: <Login /> },
]);
