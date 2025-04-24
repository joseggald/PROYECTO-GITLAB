import { createFileRoute } from '@tanstack/react-router'
import { UserRole } from '@/types/auth.types'
import { createGuard } from '@/utils/functions/guards/route.guard'
import ProductPage from '@/features/Products/components/ProductPage';
export const Route = createFileRoute(
  '/_authenticated/dashboard/gestion/inventario/',
)({
  component: ProductPage,
  beforeLoad: createGuard({
    roles: [UserRole.SUPERVISOR],
  })
})

