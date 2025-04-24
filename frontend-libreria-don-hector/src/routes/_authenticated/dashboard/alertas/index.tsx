import { createFileRoute } from '@tanstack/react-router'
import { UserRole } from '@/types/auth.types'
import { createGuard } from '@/utils/functions/guards/route.guard'
import AlertPage from '@/features/ListAlert/components/AlertPage';

export const Route = createFileRoute('/_authenticated/dashboard/alertas/')({
  component: AlertPage,
  beforeLoad: createGuard({
    roles: [UserRole.SUPERVISOR],
  })
})
