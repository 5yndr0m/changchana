Build
- docker build --no-cache -t chongjaroen:latest -f dockers/Dockerfile.alpine

Run
- docker run -it -p 7000:7000  --env-file ./.env.docker --memory="1024m" --cpus="1" --name=chongjaroen-alpine chongjaroen-alpine:latest

Tips
- Console
  -  DOCKER_BUILDKIT=0 docker build --no-cache -t chongjaroen:latest -f dockers/Dockerfile.alpine
