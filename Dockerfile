# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY ./starter/package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm cache clean --force && \
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
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Usar configuración básica de nginx (funciona para SPAs)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]