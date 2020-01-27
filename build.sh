#!/bin/bash
docker stop personal-website
docker rm personal-website

docker build -t clintonmorrison/projects:personal-website-0.0.1-dev . &&
  echo "Running container..." &&
  sh run_container.sh &&
  docker exec -it personal-website bash
