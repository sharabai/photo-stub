#!/bin/bash

git pull
sudo docker rm -fv mongodb
sudo docker compose -f docker-compose.yml up -d
cd /home/ubuntu/lucas/frontend
npm install
npm run build
sudo rm -rf /var/www/emmanuellucas.fr/static/*
sudo mv /home/ubuntu/lucas/frontend/dist/* /var/www/emmanuellucas.fr/static/
sudo chown -R www-data:www-data /var/www/emmanuellucas.fr/static
sudo chmod -R 755 /var/www/emmanuellucas.fr/static
sudo cp -f /home/ubuntu/lucas/nginx/lucas.conf /etc/nginx/conf.d/lucas.conf
sudo systemctl restart nginx
cd ../backend
npm install
pm2 restart index
pm2 save
cd ../
