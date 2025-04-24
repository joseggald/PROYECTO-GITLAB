FROM node:18-alpine as deps

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Builder stage
FROM node:18-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copiar solo dependencias de producción
COPY package.json ./
RUN npm install --omit=dev

# Copiar los archivos compilados
COPY --from=builder /app/dist ./dist

# Variables de entorno
ENV NODE_ENV=production \
    PORT=8080

# Exponer puerto
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]