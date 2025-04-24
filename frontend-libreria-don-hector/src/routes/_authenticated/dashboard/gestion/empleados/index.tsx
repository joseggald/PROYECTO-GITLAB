import { createFileRoute } from '@tanstack/react-router'
import { UserRole } from '@/types/auth.types'
import { createGuard } from '@/utils/functions/guards/route.guard'
import EmployeePage from '@/features/Employee/components/EmployeePage';
export const Route = createFileRoute(
  '/_authenticated/dashboard/gestion/empleados/',
)({
  component: EmployeePage,
  beforeLoad: createGuard({
    roles: [UserRole.SUPERVISOR],
  })
})
