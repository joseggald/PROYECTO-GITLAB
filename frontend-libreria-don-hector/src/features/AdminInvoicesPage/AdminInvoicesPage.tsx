import { useState, useEffect } from 'react';
import { Receipt, ShoppingBag, Calendar, CreditCard, FileText, ArrowRight, User, Truck, Package, Search, X, Download, Filter } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

function AdminInvoicesPage() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [filterOption, setFilterOption] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [uniqueClients, setUniqueClients] = useState<{id: number, name: string}[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        const invoicesData = await cartService.getAllInvoices();
        setInvoices(invoicesData);
        setFilteredInvoices(invoicesData);
        
        // Extraer clientes únicos para el filtro
        const clients = invoicesData.reduce((acc: {id: number, name: string}[], invoice: Invoice) => {
          if (!acc.some(client => client.id === invoice.id_cliente)) {
            acc.push({ 
              id: invoice.id_cliente, 
              name: `${invoice.cliente_nombre} ${invoice.cliente_apellido}` 
            });
          }
          return acc;
        }, []);
        
        setUniqueClients(clients);
        
        // Calcular estadísticas
        const total = invoicesData.reduce((sum: number, invoice: Invoice) => sum + Number(invoice.total_venta), 0);
        setTotalAmount(total);
        setTotalInvoices(invoicesData.length);
        
      } catch (error) {
        console.error('Error al cargar facturas:', error);
        setIsError(true);
        toast({
          title: "Error",
          description: "No se pudieron cargar las facturas. Por favor, intenta nuevamente más tarde.",
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

    // Aplicar filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(invoice => 
        invoice.id_factura.toString().includes(query) ||
        invoice.nombre_comprador.toLowerCase().includes(query) ||
        (invoice.cliente_nombre && invoice.cliente_nombre.toLowerCase().includes(query)) ||
        (invoice.cliente_apellido && invoice.cliente_apellido.toLowerCase().includes(query)) ||
        (invoice.metodo_pago_tipo && invoice.metodo_pago_tipo.toLowerCase().includes(query)) ||
        new Date(invoice.fecha_emision).toLocaleDateString().includes(query)
      );
    }
    
    // Aplicar filtro por tipo
    if (filterOption !== 'all') {
      switch (filterOption) {
        case 'employee':
          result = result.filter(invoice => invoice.id_empleado !== null);
          break;
        case 'client':
          result = result.filter(invoice => !invoice.id_empleado);
          break;
      }
    }
    
    // Aplicar filtro de cliente
    if (selectedClient !== 'all') {
      const clientId = parseInt(selectedClient);
      result = result.filter(invoice => invoice.id_cliente === clientId);
    }
    
    // Aplicar filtro de rango de fechas
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Incluir todo el día final
      
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.fecha_emision);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }
    
    // Aplicar filtro de rango de precios
    if (priceRange.min || priceRange.max) {
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      
      result = result.filter(invoice => {
        const total = parseFloat(invoice.total_venta.toString());
        return total >= min && total <= max;
      });
    }

    // Aplicar ordenamiento
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
      case 'client_az':
        result.sort((a, b) => `${a.cliente_nombre} ${a.cliente_apellido}`.localeCompare(`${b.cliente_nombre} ${b.cliente_apellido}`));
        break;
      case 'client_za':
        result.sort((a, b) => `${b.cliente_nombre} ${b.cliente_apellido}`.localeCompare(`${a.cliente_nombre} ${a.cliente_apellido}`));
        break;
    }

    setFilteredInvoices(result);
  }, [invoices, searchQuery, sortOption, filterOption, selectedClient, dateRange, priceRange]);

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
    setFilterOption('all');
    setSelectedClient('all');
    setDateRange({ from: '', to: '' });
    setPriceRange({ min: '', max: '' });
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
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-gray-900 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Gestión de Facturas</h1>
          </div>
          <p className="text-purple-100 max-w-2xl">
            Panel administrativo para gestionar todas las facturas del sistema.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Resumen de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Facturas</p>
                  <h3 className="text-2xl font-bold text-gray-900">{totalInvoices}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ingresos Totales</p>
                  <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Clientes Únicos</p>
                  <h3 className="text-2xl font-bold text-gray-900">{uniqueClients.length}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingOverlay/>
            <p className="mt-4 text-gray-600">Cargando facturas...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="bg-red-100 text-red-800 rounded-full p-3 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Error al cargar las facturas</h3>
            <p className="mt-2 text-gray-600">
              Lo sentimos, ha ocurrido un error al cargar las facturas. Por favor, intenta nuevamente más tarde.
            </p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="bg-purple-100 text-purple-800 rounded-full p-6 mb-6">
              <Receipt className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay facturas registradas</h3>
            <p className="mt-2 text-gray-600 max-w-md">
              No se encontraron facturas en el sistema.
            </p>
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
                    Volver a la lista de facturas
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
                
                <Card className="overflow-hidden shadow-md border-purple-100">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-gray-50 border-b pb-4">
                    <div className="flex flex-wrap justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                          <Receipt className="h-6 w-6 text-purple-600" />
                          Factura #{selectedInvoice.id_factura}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Emitida el {formatDate(selectedInvoice.fecha_emision)}
                        </CardDescription>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1 text-sm">
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
                          {selectedInvoice.id_empleado && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500">Compra realizada por empleado:</p>
                              <p className="text-gray-700 text-sm">{selectedInvoice.empleado_nombre} {selectedInvoice.empleado_apellido}</p>
                            </div>
                          )}
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
                        
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <h3 className="text-sm font-medium text-purple-700 flex items-center gap-2 mb-2">
                            <CreditCard className="h-4 w-4" />
                            Información de Pago
                          </h3>
                          <div className="flex justify-between font-bold text-lg text-purple-800">
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
                                          <div className="h-10 w-10 rounded bg-purple-50 flex items-center justify-center">
                                            <ShoppingBag className="h-6 w-6 text-purple-300" />
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
                                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
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
                        <div className="flex justify-between items-center text-lg font-bold mt-2">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-purple-800">{formatCurrency(selectedInvoice.total_venta)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t py-4 mt-6">
                    <div className="w-full flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Información de factura #{selectedInvoice.id_factura}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadPDF(selectedInvoice.id_factura)}
                        disabled={isDownloading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading ? 'Descargando...' : 'Descargar PDF'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar por número, cliente, método de pago..."
                          className="pl-9 border-gray-200 focus:border-purple-500 focus-visible:ring-purple-500/20"
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
                    
                    <div className="md:col-span-3">
                      <Select
                        value={sortOption}
                        onValueChange={setSortOption}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-purple-500 focus-visible:ring-purple-500/20">
                          <SelectValue placeholder="Ordenar por..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Más recientes primero</SelectItem>
                          <SelectItem value="oldest">Más antiguos primero</SelectItem>
                          <SelectItem value="highest">Mayor importe</SelectItem>
                          <SelectItem value="lowest">Menor importe</SelectItem>
                          <SelectItem value="client_az">Cliente (A-Z)</SelectItem>
                          <SelectItem value="client_za">Cliente (Z-A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-3">
                      <Select
                        value={filterOption}
                        onValueChange={setFilterOption}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-purple-500 focus-visible:ring-purple-500/20">
                          <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las facturas</SelectItem>
                          <SelectItem value="client">Compras de clientes</SelectItem>
                          <SelectItem value="employee">Ventas por empleados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-1">
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2"
                        onClick={() => setShowFilterDialog(true)}
                      >
                        <Filter className="h-4 w-4" />
                        Filtros
                      </Button>
                      
                      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Filtros avanzados</DialogTitle>
                            <DialogDescription>
                              Personaliza los criterios de búsqueda para las facturas
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Rango de fechas</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Desde</label>
                                  <Input 
                                    type="date" 
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
                                  <Input 
                                    type="date" 
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Rango de importe</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Mínimo (GTQ)</label>
                                  <Input 
                                    type="number" 
                                    placeholder="0"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Máximo (GTQ)</label>
                                  <Input 
                                    type="number" 
                                    placeholder="99999"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Cliente específico</h4>
                              <Select
                                value={selectedClient}
                                onValueChange={setSelectedClient}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos los clientes</SelectItem>
                                  {uniqueClients.map((client) => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                      {client.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <Button variant="outline" onClick={handleReset}>
                              Limpiar filtros
                            </Button>
                            <Button onClick={() => setShowFilterDialog(false)}>
                              Aplicar filtros
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  {(searchQuery || sortOption !== 'recent' || filterOption !== 'all' || selectedClient !== 'all' || dateRange.from || dateRange.to || priceRange.min || priceRange.max) && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {filteredInvoices.length} resultado{filteredInvoices.length !== 1 && 's'} encontrado{filteredInvoices.length !== 1 && 's'}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleReset}
                        className="text-gray-600 hover:text-purple-700"
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
                        No hay facturas que coincidan con tu búsqueda. Intenta con otros términos o ajusta los filtros.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                      >
                        Mostrar todas las facturas
                      </Button>
                    </div>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <Card 
                        key={invoice.id_factura} 
                        className="overflow-hidden hover:border-purple-200 transition-all duration-300 hover:shadow-md group"
                      >
                        <CardContent className="p-0">
                          <div className="grid md:grid-cols-5 gap-3">
                            <div className="md:col-span-3 p-4 flex flex-col">
                              <div className="flex items-start gap-3">
                                <div className="bg-purple-100 p-2 rounded-md flex-shrink-0">
                                  <Receipt className="h-5 w-5 text-purple-700" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 flex items-center">
                                    Factura #{invoice.id_factura}
                                    <Badge className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
                                      {calculateTotalItems(invoice)} {calculateTotalItems(invoice) === 1 ? 'artículo' : 'artículos'}
                                    </Badge>
                                    
                                    {invoice.id_empleado && (
                                      <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                        Venta por empleado
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {formatDate(invoice.fecha_emision)}
                                  </p>
                                  
                                  <div className="mt-1">
                                    <p className="text-sm">
                                      <span className="text-gray-500">Cliente:</span>{' '}
                                      <span className="text-gray-700 font-medium">
                                        {invoice.cliente_nombre} {invoice.cliente_apellido}
                                      </span>
                                    </p>
                                  </div>
                                  
                                  <div className="mt-3 flex items-center gap-2 text-sm">
                                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
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
                                  <span className="text-lg font-bold text-purple-800">{formatCurrency(invoice.total_venta)}</span>
                                </div>
                                
                                {invoice.id_empleado && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Vendedor:</span>
                                      <span className="text-xs font-medium text-gray-700">
                                        {invoice.empleado_nombre} {invoice.empleado_apellido}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2">
                                <Button 
                                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white group-hover:shadow-sm transition-all"
                                  onClick={() => viewInvoiceDetails(invoice)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalles
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  onClick={() => handleDownloadPDF(invoice.id_factura)}
                                  className="flex-shrink-0"
                                  disabled={isDownloading}
                                >
                                  <Download className="h-4 w-4" />
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

export default AdminInvoicesPage;