import Header from "@/components/Dashboard/Header/Header";
import { createGuard } from "@/utils/functions/guards/route.guard";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  ),
  beforeLoad: createGuard(),
});
