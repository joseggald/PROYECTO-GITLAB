import { createFileRoute } from '@tanstack/react-router'
import ProductosPage from '@/features/PublicBooks/components/ProductosPage';
export const Route = createFileRoute('/productos/')({
  component: ProductosPage,
})

