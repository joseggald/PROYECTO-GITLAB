import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { 
  Book as BookIcon, 
  LogIn, 
  UserPlus, 
  Heart, 
  Search, 
  ShoppingBag, 
  Star, 
  ChevronRight,
  CheckCircle,
  User
} from 'lucide-react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Definición simple del tipo de libro
interface Book {
  id_producto: number;
  nombre: string;
  descripcion: string;
  autor: string;
  categoria: string;
  precio_venta: string;
  fecha_lanzamiento: string;
  stock: number;
  imagen: string | null;
}

export const Route = createFileRoute('/productos/')({
  component: ProductosPage,
});

function ProductosPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://backend-libreria-395333172641.us-central1.run.app/productos');
        setBooks(response.data.data.books || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los libros');
        console.error('Error fetching books:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filtrar libros basados en el término de búsqueda
  const filteredBooks = books.filter(book => 
    book.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para formatear precios
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(numAmount);
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Intl.DateTimeFormat('es-GT', options).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50">
      <div className="relative bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white py-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-600/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-600/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-yellow-500/20 rounded-full"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <Badge className="mb-4 bg-yellow-600/90 text-white hover:bg-yellow-600 border-none px-3 py-1.5">
                Librería Don Hector
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Descubre un mundo de <span className="text-yellow-300">historias</span> que te esperan
              </h1>
              <p className="text-xl mb-8 text-yellow-100/90 max-w-2xl">
                En nuestra colección encontrarás los mejores títulos para todos los gustos. 
                Desde clásicos hasta las últimas novedades.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-yellow-800 hover:bg-yellow-100 transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
                  asChild
                >
                  <Link to="/register">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Crear Cuenta
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-yellow-800 hover:bg-yellow-100 transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
                  asChild
                >
                  <Link to="/register">
                    <User className="h-5 w-5 mr-2" />
                    Iniciar Sesion
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:w-2/5 relative">
              <div className="relative z-10 bg-gradient-to-br from-yellow-50 to-white p-6 rounded-2xl shadow-2xl border border-yellow-200/50 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="absolute -right-3 -top-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Destacado
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <BookIcon className="h-5 w-5 text-yellow-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Librería Don Hector</h3>
                </div>
                
                {books.length > 0 && (
                  <>
                    <div className="mb-3">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{books[0].nombre}</h4>
                      <p className="text-sm text-gray-600">{books[0].autor}</p>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">(4.0)</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {books[0].descripcion}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-yellow-700">
                        {formatCurrency(books[0].precio_venta)}
                      </span>
                      <Button 
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        asChild
                      >
                        <Link to="/login">
                          Ver más
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
                
                {books.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <BookIcon className="h-16 w-16 text-yellow-700/50 mb-4" />
                    <p className="text-gray-500 text-center">Cargando información del libro destacado...</p>
                  </div>
                )}
              </div>
              
              <div className="hidden lg:block absolute -bottom-6 -left-6 h-24 w-24 bg-yellow-500/10 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </div>
    
      
      <div className="container mx-auto px-4 mt-20">
        <div className="relative max-w-xl mx-auto mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-100 opacity-50 blur-lg rounded-lg transform -translate-y-4 scale-[0.95]"></div>
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-yellow-700" />
            <input
              type="text"
              placeholder="Buscar por título, autor o categoría..."
              className="w-full pl-12 pr-4 py-4 border-2 border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {/* Catálogo de libros */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <ShoppingBag className="h-4 w-4 text-yellow-700" />
              </span>
              Nuestro Catálogo
            </h2>
            
            {filteredBooks.length > 0 && searchTerm && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
                {filteredBooks.length} resultados para "{searchTerm}"
              </Badge>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-600 mb-4"></div>
              <p className="text-yellow-800">Cargando libros para ti...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4 bg-red-50 rounded-xl border border-red-100">
              <div className="inline-flex h-20 w-20 rounded-full bg-red-100 items-center justify-center mb-4">
                <Search className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">{error}</h3>
              <p className="text-red-600 max-w-md mx-auto mb-6">
                Lo sentimos, no pudimos cargar los libros en este momento. Por favor, intenta nuevamente.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reintentar
              </Button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16 px-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="inline-flex h-20 w-20 rounded-full bg-yellow-100 items-center justify-center mb-4">
                <Search className="h-10 w-10 text-yellow-700" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">No se encontraron libros</h3>
              <p className="text-yellow-700 max-w-md mx-auto mb-6">
                No hay libros que coincidan con tu búsqueda "{searchTerm}". 
                Intenta con otros términos o explora nuestro catálogo completo.
              </p>
              <Button 
                onClick={() => setSearchTerm('')} 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Ver todos los libros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card 
                  key={book.id_producto} 
                  className="group h-full flex flex-col overflow-hidden border-2 border-transparent hover:border-yellow-200 hover:shadow-xl transition-all duration-300 bg-white"
                  onMouseEnter={() => setHoveredCard(book.id_producto)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardHeader className="p-0 h-56 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-gray-200 group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookIcon className="h-20 w-20 text-yellow-700/30" />
                      </div>
                    </div>
                    
                    <div className="absolute top-0 left-0 w-full p-4">
                      <div className="flex justify-between">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          {book.categoria}
                        </Badge>
                        
                        <Badge className={`${
                          parseInt(book.stock.toString()) > 0 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {parseInt(book.stock.toString()) > 0 ? 'Disponible' : 'Agotado'}
                        </Badge>
                      </div>
                    </div>
                    
                    {hoveredCard === book.id_producto && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          className="bg-white text-yellow-800 hover:bg-yellow-100"
                          asChild
                        >
                          <Link to="/login">
                            <span>Ver detalles</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-grow p-6">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-yellow-700 transition-colors duration-300 mb-2">
                      {book.nombre}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Por:</span> {book.autor}
                    </p>
                    
                    <p className="text-xs text-gray-500 mb-4">
                      Publicado: {formatDate(book.fecha_lanzamiento)}
                    </p>
                    
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                      {book.descripcion || "No hay descripción disponible para este libro."}
                    </p>
                    
                    <div className="mt-auto">
                      <span className="text-2xl font-bold text-yellow-700">
                        {formatCurrency(book.precio_venta)}
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-3 w-full">
                      <Button 
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                        asChild
                      >
                        <Link to="/login">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Comprar
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                        asChild
                      >
                        <Link to="/login">
                          <Heart className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="relative bg-gradient-to-br from-yellow-50 to-white py-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-yellow-100 rounded-full translate-x-1/3 -translate-y-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-yellow-200/50 rounded-full -translate-x-1/4 translate-y-1/4 z-0"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-yellow-100 p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-7/12">
                <Badge className="mb-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                  ¡Únete a nosotros!
                </Badge>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Crea tu cuenta y empieza a disfrutar
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Regístrate para poder comprar tus libros favoritos y guardarlos en tu lista de deseos. 
                  Además, tendrás acceso a descuentos exclusivos.
                </p>
                
                <ul className="space-y-3 mb-6">
                  {[
                    'Compra tus libros favoritos',
                    'Guarda títulos en tu lista de deseos',
                    'Recibe recomendaciones personalizadas',
                    'Accede a ofertas exclusivas'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    asChild
                  >
                    <Link to="/register">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Crear cuenta
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-yellow-600 text-yellow-700 hover:bg-yellow-50"
                    asChild
                  >
                    <Link to="/login">
                      <LogIn className="h-5 w-5 mr-2" />
                      Iniciar sesión
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-5/12 flex justify-center">
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full opacity-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookIcon className="h-24 w-24 text-yellow-600" />
                  </div>
                  <div className="absolute -right-2 -bottom-2 bg-white p-3 rounded-full shadow-lg border border-yellow-100 transform rotate-6">
                    <ShoppingBag className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="absolute -left-2 -top-2 bg-white p-3 rounded-full shadow-lg border border-yellow-100 transform -rotate-6">
                    <Heart className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <BookIcon className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-xl font-bold">Librería Don Hector</h3>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                © {new Date().getFullYear()} Librería Don Hector. Todos los derechos reservados.
              </p>
              <div className="flex justify-center md:justify-end space-x-4">
                <Link to="/login" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProductosPage;