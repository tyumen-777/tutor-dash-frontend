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
      <div className="flex">
        <SidebarProvider>
          <AppSidebar />
          <main>
            <div className="border-2 rounded-sm my-2 mx-2">
              <SidebarTrigger />
            </div>
          </main>
          <div className="ml-auto w-full max-w-full flex h-svh flex-col pt-2 pl-2 pr-2">
            <Outlet />
          </div>
        </SidebarProvider>
      </div>
    </div>
  ) : (
    <Navigate to={APP_ROUTES.LOGIN} />
  );
}

export default App;
