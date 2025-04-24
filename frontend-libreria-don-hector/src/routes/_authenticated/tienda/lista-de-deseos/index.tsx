import { createFileRoute } from '@tanstack/react-router';
import WishlistPage from '@/features/Wishlist/components/WishlistPage';

export const Route = createFileRoute('/_authenticated/tienda/lista-de-deseos/')({
  component: WishlistPage,
});

export default Route;