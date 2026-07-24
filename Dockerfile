# Vitrine estática de OBE Informática — servida por nginx (sin build step).
FROM nginx:1.27-alpine

# Config del sitio (SPA con enrutado por hash → no requiere rewrites)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Archivos estáticos del sitio
COPY index.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
