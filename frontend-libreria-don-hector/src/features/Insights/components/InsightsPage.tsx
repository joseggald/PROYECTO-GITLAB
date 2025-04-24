import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingOverlay } from '@/components/Loader/Loader';
import { BookOpen, BarChart3, Star, ShoppingCart, Heart, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInsights } from '../hooks/useInsights';
import { TopRatedProduct } from '../services/insights.service';
import { useNavigate } from '@tanstack/react-router';
import { BookDetails } from '@/features/Books/components/BookDetails'; 
import FloatingCart from '@/components/ShoppingCart/components/FloatingCart';
import AddToCartButton from '@/components/ShoppingCart/components/AddToCartButton';

export const Route = createFileRoute('/_authenticated/tienda/insights/')({
  component: InsightsPage,
});

function InsightsPage() {
  const navigate = useNavigate();
  const {
    topRatedProducts,
    userStats,
    categoryStats,
    ratingStats,
    isLoading,
    error,
    fetchInsights,
    handleViewDetails,
    handleCloseDetails,
    selectedBook,
    isDetailsOpen
  } = useInsights();

  const handleCheckoutSuccess = () => {
    setTimeout(() => {
      navigate({ to: '/tienda/mis-compras' });
    }, 2000);
  };

  const adaptToBookFormat = (product: TopRatedProduct) => {
    return {
      id_producto: product.id_producto,
      nombre: product.nombre,
      descripcion: product.descripcion,
      codigo_producto: product.id_producto.toString(),
      categoria: product.categoria,
      precio_compra: parseFloat(product.precio_venta) * 0.7, // Estimado
      precio_venta: parseFloat(product.precio_venta),
      stock: 10, // Valor por defecto
      imagen: product.imagen,
      es_libro: true,
      autor: "Autor no disponible", // Valor por defecto
      fecha_lanzamiento: new Date().toISOString(),
      inWishlist: product.en_wishlist
    };
  };

  const renderBookCard = (book: TopRatedProduct) => {
    const rating = parseFloat(book.calificacion_promedio) || 0;
    
    return (
      <Card key={book.id_producto} className="h-full flex flex-col overflow-hidden border border-gray-200 hover:border-yellow-500/50 hover:shadow-lg group">
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-yellow-100 to-gray-200 flex items-center justify-center">
          {book.imagen ? (
            <img src={book.imagen} alt={book.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <BookOpen className="h-16 w-16 text-yellow-700/50" />
          )}
        </div>
        
        <CardContent className="flex-grow flex flex-col gap-2 p-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-yellow-800 transition-colors duration-300">
            {book.nombre}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">{book.descripcion}</p>
          
          <div className="mt-auto">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
              {book.categoria}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-yellow-800">
              Q{parseFloat(book.precio_venta).toFixed(2)}
            </span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
          
          <div className="flex gap-1 mt-2">
            {book.comprado && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                <ShoppingCart className="h-3 w-3 mr-1" /> Comprado
              </span>
            )}
            {book.en_wishlist && (
              <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full flex items-center">
                <Heart className="h-3 w-3 mr-1" /> En favoritos
              </span>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-yellow-600 text-yellow-700 hover:bg-yellow-700 hover:text-white"
              onClick={() => handleViewDetails(book)}
            >
              <Eye className="h-4 w-4 mr-1" /> Ver
            </Button>
            
            {!book.comprado && (
              <AddToCartButton 
                product={adaptToBookFormat(book)}
                variant="outline"
                size="sm"
                className="flex-1"
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCategoryChart = () => {
    if (!categoryStats || categoryStats.length === 0) {
      return <div className="text-center p-6 text-gray-500">No hay datos de categorías disponibles</div>;
    }
    
    const maxCount = Math.max(...categoryStats.map(cat => cat.count));
    
    return (
      <div className="space-y-3">
        {categoryStats.map((category, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium truncate">{category.name}</span>
              <span className="text-gray-500">{category.count} libros</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-yellow-600 h-2.5 rounded-full" 
                style={{ width: `${(category.count / maxCount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRatingStats = () => {
    if (!ratingStats || ratingStats.every(r => r.count === 0)) {
      return <div className="text-center p-6 text-gray-500">No hay calificaciones disponibles</div>;
    }
    
    const totalReviews = ratingStats.reduce((sum, item) => sum + item.count, 0);
    
    return (
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map(rating => {
          const ratingData = ratingStats.find(item => item.rating === rating) || { rating, count: 0 };
          const percentage = totalReviews > 0 ? Math.round((ratingData.count / totalReviews) * 100) : 0;
          
          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center min-w-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 min-w-14 text-right">{percentage}%</span>
            </div>
          );
        })}
        <div className="text-sm text-gray-500 text-center pt-2">
          Basado en {totalReviews} calificaciones
        </div>
      </div>
    );
  };

  const handleRefresh = () => {
    fetchInsights(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <LoadingOverlay />
        <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Error</h3>
        <p className="mt-2 text-gray-600 text-center max-w-md">{error}</p>
        <Button 
          onClick={handleRefresh} 
          className="mt-4 bg-yellow-700 hover:bg-yellow-800 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <BarChart3 className="h-10 w-10" />
              Panel de Estadísticas
            </h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="text-white hover:bg-white/20 border-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
          <p className="mt-2 text-yellow-100 max-w-2xl">
            Explora los libros mejor calificados y los patrones de compra en nuestra librería
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Libros Comprados</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{userStats.purchasedCount}</h3>
              </div>
              <div className="p-4 bg-yellow-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-yellow-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">En Lista de Deseos</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{userStats.wishlistCount}</h3>
              </div>
              <div className="p-4 bg-yellow-100 rounded-full">
                <Heart className="h-6 w-6 text-yellow-700" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-yellow-600" />
                Distribución por Categorías
              </CardTitle>
              <CardDescription>
                Categorías más populares en nuestra biblioteca
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCategoryChart()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Distribución de Calificaciones
              </CardTitle>
              <CardDescription>
                Cómo califican los usuarios nuestros libros
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderRatingStats()}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Productos Destacados
            </CardTitle>
            <CardDescription>
              Libros con mayor interacción de usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topRatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topRatedProducts.map(renderBookCard)}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-yellow-700" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No hay productos destacados</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Todavía no hay productos con interacciones suficientes para mostrar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedBook && (
        <BookDetails 
          book={adaptToBookFormat(selectedBook)} 
          isOpen={isDetailsOpen} 
          onClose={handleCloseDetails}
          footer={
            <AddToCartButton 
              product={adaptToBookFormat(selectedBook)} 
              showQuantity 
              fullWidth 
              className="mt-4"
            />
          }
        />
      )}
      
      <FloatingCart 
        onCheckoutSuccess={handleCheckoutSuccess}
        position="bottom-right"
      />
    </div>
  );
}

export default InsightsPage;