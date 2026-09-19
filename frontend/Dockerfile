# ---- Etape 1 : build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Etape 2 : service des fichiers statiques ----
FROM nginx:alpine
COPY --from=build /app/dist/gestion-etudiants-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
