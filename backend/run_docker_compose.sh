# create new docker-compose
docker-compose -f docker-compose.dev.yml up

# start docker-compose
docker-compose -f docker-compose.dev.yml start

# go to db environment
docker-compose -f docker-compose.dev.yml exec db psql --username postgres

# go to server
docker-compose -f docker-compose.dev.yml exec server bash