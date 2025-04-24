import { createFileRoute } from '@tanstack/react-router'
import { GestionTicketsPage } from '@/features/SupervisorSupport/pages/GestionTicketsPage'
export const Route = createFileRoute('/_authenticated/dashboard/soporte/')({
  component: GestionTicketsPage,
})
