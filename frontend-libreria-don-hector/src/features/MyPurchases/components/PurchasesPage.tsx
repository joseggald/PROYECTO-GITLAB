import { useState, useEffect } from 'react';
import { Receipt, ShoppingBag, Calendar, CreditCard, FileText, ArrowRight, User, Truck, Package, Search, X, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { LoadingOverlay } from '@/components/Loader/Loader';
import { cartService } from '@/components/ShoppingCart/services/cart.service';
import { toast } from '@/hooks/Toast/use-toast';
import { useAuthStore } from '@/store/auth/auth.store';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceDetail {
  id_producto: number;
  nombre: string;
  descripcion: string;
  codigo_producto: string;
  categoria: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  imagen: string | null;
  es_libro: boolean;
  autor: string;
  fecha_lanzamiento: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Invoice {
  id_factura: number;
  fecha_emision: string;
  nombre_comprador: string;
  total_venta: string | number;
  direccion_entrega: string;
  id_cliente: number;
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_edad: number;
  cliente_fecha_registro: string;
  id_empleado: number | null;
  empleado_nombre: string | null;
  empleado_apellido: string | null;
  empleado_telefono: string | null;
  empleado_genero: string | null;
  empleado_fecha_contratacion: string | null;
  id_metodo_pago: number;
  metodo_pago_tipo: string;
  detalles: InvoiceDetail[];
}

function PurchasesPage() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [,setActiveTab] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        if (!user?.id_cliente) {
          throw new Error("Usuario no autenticado o sin ID de cliente");
        }
        
        const invoicesData = await cartService.getUserInvoices(user.id_cliente);
        setInvoices(invoicesData);
        setFilteredInvoices(invoicesData);
      } catch (error) {
        console.error('Error al cargar facturas:', error);
        setIsError(true);
        toast({
          title: "Error",
          description: "No se pudieron cargar tus compras. Por favor, intenta nuevamente más tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  useEffect(() => {
    let result = [...invoices];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(invoice => 
        invoice.id_factura.toString().includes(query) ||
        invoice.nombre_comprador.toLowerCase().includes(query) ||
        (invoice.metodo_pago_tipo && invoice.metodo_pago_tipo.toLowerCase().includes(query)) ||
        new Date(invoice.fecha_emision).toLocaleDateString().includes(query)
      );
    }

    switch (sortOption) {
      case 'recent':
        result.sort((a, b) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.fecha_emision).getTime() - new Date(b.fecha_emision).getTime());
        break;
      case 'highest':
        result.sort((a, b) => Number(b.total_venta) - Number(a.total_venta));
        break;
      case 'lowest':
        result.sort((a, b) => Number(a.total_venta) - Number(b.total_venta));
        break;
    }

    setFilteredInvoices(result);
  }, [invoices, searchQuery, sortOption]);

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSearchQuery('');
    setSortOption('recent');
    setActiveTab('all');
  };

  const calculateTotalItems = (invoice: Invoice) => {
    return invoice.detalles.reduce((total, item) => total + item.cantidad, 0);
  };

  const handleDownloadPDF = async (invoiceId: number) => {
    try {
      setIsDownloading(true);
      await cartService.downloadPDF(invoiceId);
      
      toast({
        title: "Éxito",
        description: "Factura descargada correctamente",
        variant: "default",
      });
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar la factura. Intenta nuevamente más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Mis Compras</h1>
          </div>
          <p className="text-yellow-100 max-w-2xl">
            Aquí puedes ver el historial de todas tus compras y consultar los detalles de tus facturas.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingOverlay/>
            <p className="mt-4 text-gray-600">Cargando tus compras...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Error al cargar tus compras</h3>
            <p className="mt-2 text-gray-600">
              Lo sentimos, ha ocurrido un error al cargar tus compras. Por favor, intenta nuevamente más tarde.
            </p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="bg-yellow-100 text-yellow-800 rounded-full p-6 mb-6">
              <ShoppingBag className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No tienes compras aún</h3>
            <p className="mt-2 text-gray-600 max-w-md">
              No has realizado ninguna compra todavía. Explora nuestro catálogo y encuentra tus libros favoritos.
            </p>
            <Button 
              className="mt-6 bg-yellow-700 hover:bg-yellow-800 text-white"
              onClick={() => window.location.href = '/tienda/libros'}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Explorar Librería
            </Button>
          </div>
        ) : (
          <div>
            {showInvoiceDetails && selectedInvoice ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    className="flex items-center group transition-all duration-300"
                    onClick={() => setShowInvoiceDetails(false)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Volver a la lista de compras
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={isDownloading}>
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading ? 'Exportando...' : 'Exportar'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownloadPDF(selectedInvoice.id_factura)}>
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Descargar PDF</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <Card className="overflow-hidden shadow-md border-yellow-100">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-gray-50 border-b pb-4">
                    <div className="flex flex-wrap justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-yellow-800 flex items-center gap-2">
                          <Receipt className="h-6 w-6 text-yellow-600" />
                          Factura #{selectedInvoice.id_factura}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Emitida el {formatDate(selectedInvoice.fecha_emision)}
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 text-sm">
                        {selectedInvoice.metodo_pago_tipo}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            Información del Cliente
                          </h3>
                          <p className="text-gray-900 font-medium">{selectedInvoice.nombre_comprador}</p>
                          <p className="text-gray-700 text-sm mt-1">
                            {selectedInvoice.cliente_nombre} {selectedInvoice.cliente_apellido}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4" />
                            Dirección de Entrega
                          </h3>
                          <p className="text-gray-900">{selectedInvoice.direccion_entrega}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            Detalles de la Compra
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Fecha:</p>
                            <p className="text-gray-900 font-medium">{formatDate(selectedInvoice.fecha_emision)}</p>
                            
                            <p className="text-gray-600">Método:</p>
                            <p className="text-gray-900 font-medium">{selectedInvoice.metodo_pago_tipo}</p>
                            
                            <p className="text-gray-600">Total artículos:</p>
                            <p className="text-gray-900 font-medium">{calculateTotalItems(selectedInvoice)}</p>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                          <h3 className="text-sm font-medium text-yellow-700 flex items-center gap-2 mb-2">
                            <CreditCard className="h-4 w-4" />
                            Información de Pago
                          </h3>
                          <div className="flex justify-between font-bold text-lg text-yellow-800">
                            <span>Total:</span>
                            <span>{formatCurrency(selectedInvoice.total_venta)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Productos Adquiridos
                      </h3>
                      <div className="border rounded-md overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Producto
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Categoría
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Precio unitario
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Cantidad
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedInvoice.detalles.map((detail, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-100 rounded overflow-hidden">
                                        {detail.imagen ? (
                                          <img className="h-10 w-10 object-cover" src={detail.imagen} alt={detail.nombre} />
                                        ) : (
                                          <div className="h-10 w-10 rounded bg-yellow-50 flex items-center justify-center">
                                            <ShoppingBag className="h-6 w-6 text-yellow-300" />
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {detail.nombre}
                                        </div>
                                        {detail.autor && (
                                          <div className="text-xs text-gray-500">
                                            {detail.autor}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                      {detail.categoria}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatCurrency(detail.precio_unitario)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {detail.cantidad}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(detail.precio_unitario * detail.cantidad)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <div className="bg-gray-50 p-4 rounded-md border w-full max-w-md">
                        <div className="flex justify-between items-center text-sm mb-3 pb-3 border-b border-gray-200">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-gray-900">{formatCurrency(Number(selectedInvoice.total_venta) - 25)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-3 pb-3 border-b border-gray-200">
                          <span className="text-gray-600">Envío:</span>
                          <span className="text-gray-900">{formatCurrency(25)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold mt-2 pt-1">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-yellow-800">{formatCurrency(selectedInvoice.total_venta)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t py-4 mt-6">
                    <div className="w-full flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Gracias por tu compra en nuestra librería
                      </p>
                      <Button
                        className="bg-yellow-700 hover:bg-yellow-800 text-white"
                        onClick={() => window.location.href = '/tienda/libros'}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Comprar más libros
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar por número de factura, método de pago, fecha..."
                          className="pl-9 border-gray-200 focus:border-yellow-500 focus-visible:ring-yellow-500/20"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setSearchQuery('')}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <Select
                        value={sortOption}
                        onValueChange={setSortOption}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-yellow-500 focus-visible:ring-yellow-500/20">
                          <SelectValue placeholder="Ordenar por..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Más recientes primero</SelectItem>
                          <SelectItem value="oldest">Más antiguos primero</SelectItem>
                          <SelectItem value="highest">Mayor importe</SelectItem>
                          <SelectItem value="lowest">Menor importe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {(searchQuery || sortOption !== 'recent') && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {filteredInvoices.length} resultado{filteredInvoices.length !== 1 && 's'} encontrado{filteredInvoices.length !== 1 && 's'}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleReset}
                        className="text-gray-600 hover:text-yellow-700"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-4">
                  {filteredInvoices.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <Search className="h-12 w-12 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                      <p className="text-gray-600 mb-4">
                        No hay compras que coincidan con tu búsqueda. Intenta con otros términos.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                      >
                        Mostrar todas las compras
                      </Button>
                    </div>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <Card 
                        key={invoice.id_factura} 
                        className="overflow-hidden hover:border-yellow-200 transition-all duration-300 hover:shadow-md group"
                      >
                        <CardContent className="p-0">
                          <div className="grid md:grid-cols-5 gap-3">
                            <div className="md:col-span-3 p-4 flex flex-col">
                              <div className="flex items-start gap-3">
                                <div className="bg-yellow-100 p-2 rounded-md flex-shrink-0">
                                  <Receipt className="h-5 w-5 text-yellow-700" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 flex items-center">
                                    Factura #{invoice.id_factura}
                                    <Badge className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
                                      {calculateTotalItems(invoice)} {calculateTotalItems(invoice) === 1 ? 'artículo' : 'artículos'}
                                    </Badge>
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {formatDate(invoice.fecha_emision)}
                                  </p>
                                  
                                  <div className="mt-3 flex items-center gap-2 text-sm">
                                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                      {invoice.metodo_pago_tipo}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                {invoice.detalles.slice(0, 2).map((item, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                      {item.imagen ? (
                                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                      ) : (
                                        <ShoppingBag className="h-4 w-4 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">
                                      <span className="font-medium">{item.cantidad}x</span> {item.nombre}
                                    </div>
                                  </div>
                                ))}
                                
                                {invoice.detalles.length > 2 && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    + {invoice.detalles.length - 2} artículo{invoice.detalles.length - 2 !== 1 && 's'} más
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="md:col-span-2 bg-gray-50 p-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100">
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm text-gray-500">Comprador:</span>
                                  <span className="text-sm font-medium text-gray-900">{invoice.nombre_comprador}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">Total:</span>
                                  <span className="text-lg font-bold text-yellow-800">{formatCurrency(invoice.total_venta)}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <Button 
                                  className="w-full bg-yellow-700 hover:bg-yellow-800 text-white group-hover:shadow-sm transition-all"
                                  onClick={() => viewInvoiceDetails(invoice)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalles
                                  <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchasesPage;