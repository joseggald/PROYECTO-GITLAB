import AdminInvoicesPage from '@/features/AdminInvoicesPage/AdminInvoicesPage'
import { createFileRoute } from '@tanstack/react-router'
import { createGuard } from '@/utils/functions/guards/route.guard'
import { UserRole } from '@/types/auth.types'

export const Route = createFileRoute(
  '/_authenticated/dashboard/ventas/facturas/',
)({
  component: AdminInvoicesPage,
  beforeLoad: createGuard({
    roles: [UserRole.SUPERVISOR, UserRole.GERENTE, UserRole.EMPLEADO, UserRole.CLIENTE],
  })      
})