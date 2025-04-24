import { createFileRoute } from '@tanstack/react-router'
import CommentsBookPage from '@/features/CommentsBooks/components/CommentsBookPage';
export const Route = createFileRoute('/_authenticated/dashboard/comentarios/')({
  component: CommentsBookPage,
})

