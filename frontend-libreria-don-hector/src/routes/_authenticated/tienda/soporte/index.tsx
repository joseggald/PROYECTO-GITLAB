import { createFileRoute } from '@tanstack/react-router'
import SupportPage from '@/features/UserSupport/pages/TicketsPage'

export const Route = createFileRoute('/_authenticated/tienda/soporte/')({
  component: SupportPage,
})


