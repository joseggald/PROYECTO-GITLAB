import jwt from 'jsonwebtoken';
import environment from '../config/environment';

const JWT_SECRET = environment.JWT.SECRET || 'default_secret';
const TOKEN_EXPIRATION = '1d'; // 1 día

export const generateAuthToken = (user: any): string => {
  const payload = {
    id_usuario: user.id_usuario,
    id_rol: user.id_rol,
    id_cliente: user.id_cliente || null,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};