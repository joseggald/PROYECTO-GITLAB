import { createFileRoute } from "@tanstack/react-router";
import { Unauthorized } from "@/features/unauthorized/Unauthorized";

export const Route = createFileRoute("/unauthorized/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Unauthorized />;
}
