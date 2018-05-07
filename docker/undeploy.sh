#!/bin/bash

source ./constants.sh .

echo "Removing swarm services in stack '$stackname'..."
docker stack rm $stackname
echo "Done!"

echo "Removing Nginx configuration file..."
rm -f $nginxPath/membership-rest.conf

echo "Restarting Nginx..."
docker service scale infras_nginx=0 > /dev/null
sleep 3
docker service scale infras_nginx=1 > /dev/null
echo "Done!"

sleep 5
docker service ls
