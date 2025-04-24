import { createFileRoute } from '@tanstack/react-router'
import PurchasesPage from '@/features/MyPurchases/components/PurchasesPage'

export const Route = createFileRoute('/_authenticated/tienda/mis-compras/')({
  component: PurchasesPage,
})
