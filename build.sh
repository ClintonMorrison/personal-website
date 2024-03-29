#!/bin/bash
source version.sh

echo "Building version: $VERSION"

docker stop personal-website
docker rm personal-website

docker build -t "clintonmorrison/projects:personal-website-$VERSION" . &&
  docker push "clintonmorrison/projects:personal-website-$VERSION" &&
  echo "Running container..." &&
  bash run_container.sh &&
  docker exec -it personal-website bash
