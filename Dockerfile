# Etapa de construcción
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY ./starter/package*.json ./

# Instalar dependencias
RUN npm ci --only=production

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

# Configuración de nginx para SPA
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Configuración para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]