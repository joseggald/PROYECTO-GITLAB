import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth/auth.store";
import { useAlertStore } from "@/features/GlobalAlert/store";
import { ERROR_EXPIRED_SESSION_TEXTS } from "@/utils/constants/alerts";
import { AuthResponse, LoginCredentials, User, UserRole } from "@/types/auth.types";
import { navigationService } from "@/router";
import { useCartStore } from '@/store/cart/cart.store';

const API_URL = "https://backend-libreria-395333172641.us-central1.run.app";

const alertStore = useAlertStore.getState();

const serviceApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
serviceApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { authToken } = useAuthStore.getState();
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  }
);

// Interceptor para manejar errores de autenticación
serviceApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      
      alertStore.setTitle(ERROR_EXPIRED_SESSION_TEXTS.title);
      alertStore.setDescription(ERROR_EXPIRED_SESSION_TEXTS.description); 
      alertStore.openAlert();
      
      logout();
      navigationService.goToLogin();
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await serviceApi.post<AuthResponse>('/users/login', credentials);
    const { user, token } = response.data.data;
    
    const roleMap: Record<number, UserRole> = {
      1: UserRole.GERENTE,
      2: UserRole.SUPERVISOR,
      3: UserRole.EMPLEADO,
      4: UserRole.CLIENTE,
    };
    
    // Crear objeto de usuario mapeado con todos los datos disponibles
    const mappedUser: User = {
      id: user.id_usuario.toString(),
      correo_electronico: user.correo_electronico,
      role: roleMap[user.id_rol] || UserRole.CLIENTE,
      id_rol: user.id_rol,
      id_cliente: user.id_cliente,
      id_supervisor: user.id_supervisor,
      id_empleado: user.id_empleado,
    };
    if (user.nombre) mappedUser.nombre = user.nombre;
    if (user.apellido) mappedUser.apellido = user.apellido;
    if (user.cui) mappedUser.cui = user.cui;
    if (user.edad) mappedUser.edad = user.edad;
    if (user.genero) mappedUser.genero = user.genero;
    if (user.telefono) mappedUser.telefono = user.telefono;
    if (user.estado) mappedUser.estado = user.estado;
    if (user.fecha_ingreso) mappedUser.fecha_ingreso = user.fecha_ingreso;
    if (user.fecha_contratacion) mappedUser.fecha_contratacion = user.fecha_contratacion;
    if (user.fecha_baja) mappedUser.fecha_baja = user.fecha_baja;
    if (user.razon_baja) mappedUser.razon_baja = user.razon_baja;
    if (user.fotografia) mappedUser.fotografia = user.fotografia;
    
    // Guardar el token y el usuario en el store
    const auth = useAuthStore.getState();
    auth.setTokens({ authToken: token });
    auth.setUser(mappedUser);
    
    // Guardar el cliente si existe
    if (response.data.data.client) {
      auth.setClient(response.data.data.client);
    }
    
    return mappedUser;
  },
  
  logout: async (): Promise<void> => {
    try {
      useAuthStore.getState().logout();
      useCartStore.getState().clearCart();
      navigationService.goToLogin();
    } catch (error) {
      console.error('Error en logout:', error);
      useAuthStore.getState().logout();
      navigationService.goToLogin();
    }
  },
};

export { serviceApi, authService };