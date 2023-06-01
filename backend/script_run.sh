# Build and start
docker-compose up

# Start docker containers
docker-compose start

# Remove docker
docker-compose down

# Goto container db
docker-compose exec db psql --username postgres --dbname nhacuadi

# Goto container fastapi
docker-compose exec fastapi bash
