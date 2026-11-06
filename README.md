# project-ors-api

# Docker

docker build -t project-ors-api .
docker stop my-container <!-- if running -->
docker rm project-ors-api
docker run -d -p 3000:3000 --env-file .env --name project-ors-api project-ors-api

# Debug

docker exec -it project-ors-api sh
printenv
docker logs my-container