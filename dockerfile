
# Utiliser l'image de base officielle Nginx
FROM nginx:alpine

# Copier les fichiers de l'application dans le répertoire par défaut de Nginx
COPY . /usr/share/nginx/html

#Exposer le port 80 pour le serveur Nginx
EXPOSE 80 