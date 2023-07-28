#!/bin/bash

# Install docker
yum update
yum install docker -y

# Run docker deamon
systemctl start docker

# Install docker compose
curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create docker-compose file
cat > /home/ec2-user/docker-compose.yml <<-END
version: '3'
services:
  back:
    restart: always
    image: aurelien067/ygo-cube-back:latest
    ports:
      - 80:8080
    environment:
      - MONGO_HOST=mongodb://mongo:27017
    depends_on:
      - mongo

  mongo:
    restart: always
    image: mongo
    volumes:
      - mongodb:/data/db

volumes:
  mongodb: 
END

# Download the docker image and runt the app
docker-compose -f /home/ec2-user/docker-compose.yml up -d
