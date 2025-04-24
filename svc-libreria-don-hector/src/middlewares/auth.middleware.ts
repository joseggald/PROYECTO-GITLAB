import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../utils/responses';
import { verifyToken } from '../utils/jwt';

const { sendError } = ResponseHandler;

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      sendError(res, 'Invalid or expired token', 401);
      return;
    }

    req.user = decoded;

    next();
  } catch (error) {
    sendError(res, 'Authentication failed', 401);
  }
};

export const roleMiddleware = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.id_rol) {
      sendError(res, 'Unauthorized: No role found', 403);
      return;
    }

    if (!allowedRoles.includes(req.user.id_rol)) {
      sendError(res, 'Forbidden: You do not have permission to access this resource', 403);
      return;
    }

    next();
  };
};