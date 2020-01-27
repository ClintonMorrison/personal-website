#!/bin/bash

source version.sh

docker run -d \
  --name personal-website \
  -p 8001:80 \
  -e "PERSONAL_WEBSITE_DATABASE_HOST=$PERSONAL_WEBSITE_DATABASE_HOST" \
  -e "PERSONAL_WEBSITE_DATABASE_USER=$PERSONAL_WEBSITE_DATABASE_USER" \
  -e "PERSONAL_WEBSITE_DATABASE_PASSWORD=$PERSONAL_WEBSITE_DATABASE_PASSWORD" \
  -e "PERSONAL_WEBSITE_DATABASE_NAME=$PERSONAL_WEBSITE_DATABASE_NAME" \
  "clintonmorrison/projects:personal-website-$VERSION"
