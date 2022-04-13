docker rm dsapostgis
docker build -t dsapostgis .
docker run --name dsapostgis -e POSTGRES_PASSWORD=mysecretpassword -d postgis/postgis
docker exec -ti dsapostgis psql -U postgres

