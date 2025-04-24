import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/features";
import { createPublicGuard } from "@/utils/functions/guards/route.guard";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: createPublicGuard()
});

function RouteComponent() {
  return <Onboarding />;
}
