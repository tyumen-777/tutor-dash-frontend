import { Navigate, Outlet } from "react-router-dom";
import { Header } from "@/widgets/header";
import { APP_ROUTES } from "../shared/routes.ts";
import { AppSidebar } from "src/widgets/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/kit/sidebar.tsx";

function App() {
  const isLoggedIn = true;

  return isLoggedIn ? (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div>
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
          </main>
        </SidebarProvider>
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to={APP_ROUTES.LOGIN} />
  );
}

export default App;
