import { NotFound, ServerError } from "@/features";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <ServerError />,
});
