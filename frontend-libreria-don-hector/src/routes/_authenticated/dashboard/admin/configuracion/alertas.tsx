import { UserRole } from '@/types/auth.types'
import { createGuard } from '@/utils/functions/guards/route.guard'
import { createFileRoute } from '@tanstack/react-router'
import { ConfigAlertsPage } from '@/features/ConfigAlerts'
export const Route = createFileRoute(
  '/_authenticated/dashboard/admin/configuracion/alertas',
)({
  component: ConfigAlertsPage,
  beforeLoad: createGuard({
    roles: [UserRole.GERENTE],
  }),
})

