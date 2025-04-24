import InsightsPage from '@/features/Insights/components/InsightsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tienda/insights/')({
  component: InsightsPage,
})
