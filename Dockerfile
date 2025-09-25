# Etapa de construcción - usando registro alternativo
FROM public.ecr.aws/docker/library/node:20-slim as build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY ./starter/package*.json ./

# Instalar todas las dependencias y limpiar cache
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps

# Copiar el código fuente
COPY ./starter/ ./

# Variables de entorno para el build
ARG VITE_API_BASE_URL
ARG VITE_CITAS_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CITAS_API_URL=$VITE_CITAS_API_URL

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM public.ecr.aws/docker/library/node:20-slim

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar archivos construidos
COPY --from=build /app/dist ./dist

# Exponer puerto 10000
EXPOSE 10000

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "10000"]