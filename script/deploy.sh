#!/bin/bash

cp /home/ubuntu/.env /home/ubuntu/daemabnb-deploy/.env 
cp /home/ubuntu/Gemfile /home/ubuntu/daemabnb-deploy/Gemfile
cd /home/ubuntu/daemabnb-deploy

HOST="54.163.77.46"

export DOCKER_HOST=tcp://$HOST:2376 DOCKER_TLS_VERIFY=1
export DOCKER_CERT_PATH=/home/ubuntu/docker-ca

if [ "$(docker ps -a | grep "daemabnb-api")" != "" ]; then
  docker rm -f $(docker ps -a | grep "daemabnb-api")
fi
if [ "$(docker images | grep "daemabnb-api")" != "" ]; then
  docker rmi -f $(docker images | grep "daemabnb-api")
fi

sudo build -t daemabnb-api .
sudo docker run -p 3333:3000 -d daemabnb-api