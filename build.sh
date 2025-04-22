#!/bin/bash
source version.sh

echo "Building version: $VERSION"

docker stop personal-website
docker rm personal-website

TAG="$DOCKER_REGISTRY_PROJECTS/personal-website:$VERSION"
docker build --platform linux/amd64 -t "$TAG" . &&
  docker push "$TAG" 

# echo "Running container..." &&
# bash run_container.sh &&
# docker exec -it personal-website bash
