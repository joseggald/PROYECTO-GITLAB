import { createFileRoute } from '@tanstack/react-router'
import SupportEmployeePage from '@/features/EmployeeSupport/pages/EmployeeSupportPage'

export const Route = createFileRoute(
  '/_authenticated/dashboard/ventas/tickets/',
)({
  component: SupportEmployeePage,
})


