# Docker

## To run docker compose use

```
docker compose -f docker-compose.yml up -d
```

## To import the json use

```
docker cp ./frontend/src/gallery/galleryData.json mongodb:/galleryData.json
docker exec -it mongodb bash
mongoimport --db=lucasPhotography --file=galleryData.json
```

# Helpful commands

## mongosh

```
show dbs
use lucasPhotography
show collections
db.<collectionName>.find()
```

## pm2

```
pm2 list
pm2 restart <name from the list>
pm2 logs <name from the list>
pm2 pid <name from the list>

cd ~/.pm2/logs
tail -n 30 index-error.log
```

## nginx

systemctl status nginx
sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl restart nginx
sudo lsof -i :80
sudo touch /run/nginx.pid
sudo chown www-data:www-data /run/nginx.pid
