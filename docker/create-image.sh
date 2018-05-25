#!/usr/bin/env sh

# Copy SSH keys for Docker builder to pull code from private repositories.
\cp -Rf ~/.ssh ./.ssh

docker build -t gennovative/membership-rest:1.0.0 -t gennovative/membership-rest:latest -f ./Dockerfile ..

\rm -rf ./.ssh
