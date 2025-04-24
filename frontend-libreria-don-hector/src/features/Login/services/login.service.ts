import { serviceApi } from "@/services/auth";

export interface ILoginServiceResponse {
  status: string;
  message: string;
  data: IDataLogin;
}

export interface IDataLogin {
  token: string;
  user: IUser;
  client?: IClient;
}

export interface IClient {
  id_cliente: number;
  nombre: string;
  apellido: string;
  edad: number;
  fecha_registro: string;
  id_rol: number;
}

export interface IUser {
  id_usuario: number;
  correo_electronico: string;
  id_rol: number;
  id_cliente: number | null;
  id_supervisor: number | null;
  id_empleado: number | null;
}

export interface ILoginServiceProps {
  correo_electronico: string; 
  contrasena: string;        
}

export const loginService = async (
  props: ILoginServiceProps
): Promise<ILoginServiceResponse> => {
  const { data } = await serviceApi.post<ILoginServiceResponse>(
    "/users/login",
    props
  );
  return data;
};