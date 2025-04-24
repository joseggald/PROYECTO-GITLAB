import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth/auth.store";
import { UserRole } from "@/types/auth.types";
import { authService } from "@/services/auth/auth.service";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { AlertBadge } from "@/components/Dashboard/AlertBadge";
import { 
  Book, 
  ChevronDown, 
  LogOut, 
  Settings, 
  FileText, 
  ShoppingBag,
  Database,
  BookOpen,
  Heart,
  ShoppingCart,
  Star,
  FileArchive,
  LifeBuoy ,
  Ticket 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { configService } from "../../../features/ConfigAlerts/services/config.service";

type MenuItem = {
  label: string;
  path?: string;
  icon: React.ReactNode;
  roles: UserRole[];
  submenu?: SubMenuItem[];
};

type SubMenuItem = {
  label: string;
  path: string;
  roles: UserRole[];
};

const Header = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Fetch alert count based on products with low stock
    const fetchAlertCount = async () => {
      if (user?.role === UserRole.SUPERVISOR || user?.role === UserRole.GERENTE) {
        try {
          const products = await configService.getAllProducts();
          // Count products where stock is below stock_minimo
          const lowStockProducts = products.filter(
            product => product.stock < product.stock_minimo
          );
          setAlertCount(lowStockProducts.length);
        } catch (error) {
          console.error("Error fetching product alerts:", error);
          setAlertCount(0);
        }
      }
    };
    
    fetchAlertCount();
    
    // Set up interval to check for alerts every 5 minutes
    const intervalId = setInterval(fetchAlertCount, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const menuByRole: Record<UserRole, MenuItem[]> = {
    [UserRole.GERENTE]: [
      {
        label: "Administración",
        icon: <Settings className="h-5 w-5" />,
        roles: [UserRole.GERENTE],
        submenu: [
          { label: "Supervisores", path: "/dashboard/admin/supervisores", roles: [UserRole.GERENTE] },
          { label: "Reportes", path: "/dashboard/admin/reportes", roles: [UserRole.GERENTE] },
          { label: "Configuración alertas", path: "/dashboard/admin/configuracion/alertas", roles: [UserRole.GERENTE] }
        ]
      },
      {
        label: "Facturas",
        path: "/dashboard/ventas/facturas",
        icon: <FileText className="h-5 w-5" />,
        roles: [UserRole.GERENTE]
      }
    ],
    [UserRole.SUPERVISOR]: [
      {
        label: "Gestión",
        icon: <Database className="h-5 w-5" />,
        roles: [UserRole.SUPERVISOR],
        submenu: [
          { label: "Empleados", path: "/dashboard/gestion/empleados", roles: [UserRole.SUPERVISOR] },
          { label: "Inventario", path: "/dashboard/gestion/inventario", roles: [UserRole.SUPERVISOR] }
        ]
      },
      {
        label: "Facturas",
        path: "/dashboard/ventas/facturas",
        icon: <FileText className="h-5 w-5" />,
        roles: [UserRole.SUPERVISOR]
      },
      {
        label: "Comentarios",
        path: "/dashboard/comentarios",
        icon: <Star className="h-5 w-5" />,
        roles: [UserRole.SUPERVISOR]
      },
      {
        label: "Soporte",
        path: "/dashboard/soporte",
        icon: <Ticket className="h-5 w-5" />,
        roles: [UserRole.SUPERVISOR]
      }
    ],
    [UserRole.EMPLEADO]: [
      {
        label: "Ventas",
        path: "/dashboard/ventas/productos",
        icon: <ShoppingBag className="h-5 w-5" />,
        roles: [UserRole.EMPLEADO]
      },
      {
        label: "Facturas",
        path: "/dashboard/ventas/facturas",
        icon: <FileArchive className="h-5 w-5" />,
        roles: [UserRole.EMPLEADO]
      },
      {
        label: "Tickets",
        path: "/dashboard/ventas/tickets",
        icon: <Ticket  className="h-5 w-5" />,
        roles: [UserRole.EMPLEADO]
      },
    ],
    [UserRole.CLIENTE]: [
      {
        label: "Libros",
        path: "/tienda/libros",
        icon: <BookOpen className="h-5 w-5" />,
        roles: [UserRole.CLIENTE]
      },
      {
        label: "Destacados",
        path: "/tienda/insights",
        icon: <Star className="h-5 w-5" />,
        roles: [UserRole.CLIENTE]
      },
      {
        label: "Mi lista de deseos",
        path: "/tienda/lista-de-deseos",
        icon: <Heart className="h-5 w-5" />,
        roles: [UserRole.CLIENTE]
      },
      {
        label: "Mis compras",
        path: "/tienda/mis-compras",
        icon: <ShoppingCart className="h-5 w-5" />,
        roles: [UserRole.CLIENTE]
      },
      {
        label: "Soporte",
        path: "/tienda/soporte",
        icon: <LifeBuoy  className="h-5 w-5" />,
        roles: [UserRole.CLIENTE]
      }
    ] 
  };

  const menuItems = user?.role ? menuByRole[user.role] || [] : [];
  
  const handleLogout = async () => {
    await authService.logout();
    navigate({ to: "/login" });
  };

  const getUserInitial = () => {
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    if (user.nombre && user.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    
    return user.nombre || user.correo_electronico || "Usuario";
  };

  const getUserRoleDisplay = () => {
    switch (user?.role) {
      case UserRole.GERENTE:
        return "Gerente";
      case UserRole.SUPERVISOR:
        return "Supervisor";
      case UserRole.EMPLEADO:
        return "Empleado";
      case UserRole.CLIENTE:
        return "Cliente";
      default:
        return "";
    }
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled 
            ? "bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-yellow-900/20" 
            : "bg-gradient-to-r from-yellow-800 via-gray-900 to-gray-900 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative">
                  <Book className="h-8 w-8 text-yellow-600 drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    Librería Don Hector
                  </span>
                  <span className="text-xs text-yellow-600/80">
                    Conectando a los lectores
                  </span>
                </div>
            </div>

            <nav className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-gray-200 hover:bg-yellow-900/20 hover:text-yellow-600 px-3 py-2 rounded-md font-medium"
                        >
                          <span className="flex items-center gap-2">
                            {item.icon}
                            {item.label}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 border-yellow-900/40 text-gray-200 shadow-lg shadow-black/20">
                        {item.submenu.map((subItem) => (
                          <DropdownMenuItem key={subItem.label} asChild>
                            <Link
                              to={subItem.path}
                              className="cursor-pointer hover:bg-yellow-900/30 hover:text-yellow-600"
                            >
                              {subItem.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      asChild
                      variant="ghost"
                      className="flex items-center gap-2 text-gray-200 hover:bg-yellow-900/20 hover:text-yellow-600 px-3 py-2 rounded-md font-medium"
                    >
                      <Link to={item.path || "/dashboard"}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {(user?.role === UserRole.SUPERVISOR) && (
                <Link to="/dashboard/gestion/inventario" className="relative">
                  <AlertBadge count={alertCount} />
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center gap-2 text-gray-200 hover:bg-yellow-900/20 hover:text-yellow-600 rounded-md"
                  >
                    <Avatar className="h-9 w-9 border-2 border-yellow-500/70 bg-yellow-900/30 shadow-inner shadow-yellow-600/20">
                      <AvatarFallback className="bg-yellow-900/50 text-yellow-100 font-semibold">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{getUserDisplayName()}</span>
                      <span className="text-xs text-yellow-600">{getUserRoleDisplay()}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-yellow-500/70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-800 border border-gray-700 border-t-yellow-900/50 text-gray-200 shadow-xl shadow-black/30">
                  <div className="p-2">
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer hover:bg-yellow-900/30 hover:text-yellow-600 rounded-md p-2" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 text-yellow-600" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16"></div>
    </>
  );
};

export default Header;