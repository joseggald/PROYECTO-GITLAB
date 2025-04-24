import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { Logger } from '../utils/Logger';

export const initializeMiddlewares = (app: Application): void => {
  // Seguridad básica
  app.use(helmet());
  
  // CORS
  app.use(cors({
    origin: 'https://frontend-libreria-395333172641.us-central1.run.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  }));
  
  
  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Compresión de respuestas
  app.use(compression());
  
  // Logging de requests
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan((tokens, req, res) => {
      return [
        `[${tokens.method(req, res)}]`,
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms'
      ].join(' ');
    }, {
      stream: {
        write: (message) => Logger.info(message.trim())
      }
    }));
  }
};