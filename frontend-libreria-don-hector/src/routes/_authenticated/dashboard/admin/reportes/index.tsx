import { createFileRoute } from '@tanstack/react-router'
import { UserRole } from '@/types/auth.types'
import { createGuard } from '@/utils/functions/guards/route.guard'
import ReportPage from '@/features/GraphReports/components/ReportsPage'

export const Route = createFileRoute(
  '/_authenticated/dashboard/admin/reportes/',
)({
  component: ReportPage,
  beforeLoad: createGuard({
    roles: [UserRole.GERENTE],
  }),
})


