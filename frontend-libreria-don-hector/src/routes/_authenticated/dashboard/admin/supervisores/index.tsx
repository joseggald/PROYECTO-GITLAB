import { createFileRoute } from '@tanstack/react-router'
import { UserRole } from '@/types/auth.types'
import { createGuard } from '@/utils/functions/guards/route.guard'
import SupervisoresPage from '@/features/Supervisor/components/SupervisorPage';

export const Route = createFileRoute(
  '/_authenticated/dashboard/admin/supervisores/',
)({
  component: SupervisoresPage,
  beforeLoad: createGuard({
    roles: [UserRole.GERENTE],
  })
})


