#!/bin/bash

cp /home/ubuntu/.env /home/ubuntu/daemabnb-api/.env
cd /home/ubuntu/daemabnb-api

if [ "$(docker ps -a | grep "daemabnb-api")" != "" ]; then
  docker rm -f $(docker ps -a | grep "daemabnb-api")
fi
if [ "$(docker images | grep "daemabnb-api")" != "" ]; then
  docker rmi -f $(docker images | grep "daemabnb-api")
fi
if [ "$(docker images -f "dangling=true" -q)" != ""]; then
  docker rmi $(docker images -f "dangling=true" -q)
fi

sudo docker build -t daemabnb-api .
sudo docker run -p 3333:3000 -d daemabnb-api

sudo rm -rf /home/ubuntu/daemabnb-api