#!/bin/bash

# Copy SSH keys for Docker builder to pull code from private repositories.
\cp -Rf ~/.ssh ./.ssh

docker build -t gennovative/membership-rest:1.0.0 -f ./Dockerfile ..

\rm -rf ./.ssh
