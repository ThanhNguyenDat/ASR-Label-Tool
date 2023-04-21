# dev
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml start
docker-compose -f docker-compose.dev.yml down


# build
docker build -f Dockerfile.prod -t asr_label_react_prod:latest .
docker run -it -p 8220:80 --rm asr_label_react_prod:latest