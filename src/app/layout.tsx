import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "../shared/model/routes.ts";

const Layout = () => {
  const isLoggedIn = true;

  return isLoggedIn ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <Navigate to={APP_ROUTES.LOGIN} />
  );
};

export default Layout;
