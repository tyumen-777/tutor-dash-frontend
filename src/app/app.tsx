import { Navigate, Outlet } from "react-router-dom";
import { Header } from "@/widgets/header";
import { APP_ROUTES } from "@/shared/model/routes.ts";
import { AppSidebar } from "src/widgets/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/kit/sidebar.tsx";
import { Separator } from "@/shared/ui/kit/separator.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function App() {
  const isLoggedIn = true;
  const queryClient = new QueryClient();
  return isLoggedIn ? (
    <QueryClientProvider client={queryClient}>
    <div className="min-h-screen flex flex-col mx-2">
      <Header />
      <div className="flex">
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full ml-2">
            <div className="flex items-center w-full px-2 bg-light-grey rounded-md shadow-md">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <span>some text</span>
            </div>
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
    <ReactQueryDevtools />
    </QueryClientProvider>
  ) : (
    <Navigate to={APP_ROUTES.LOGIN} />
  );
}

export default App;
