#!/bin/bash

source ./constants.sh .

echo "Creating swarm services in stack '$stackname'..."
docker stack deploy -c docker-compose.yml $stackname
echo "Done!"

echo "Copying Nginx configuration for Web virtual host..."
cp -f ./membership-rest.conf $nginxPath
echo "Restarting Nginx..."
docker service scale infras_nginx=0 > /dev/null
sleep 3
docker service scale infras_nginx=1 > /dev/null
echo "Done!"

sleep 5
docker service ls
