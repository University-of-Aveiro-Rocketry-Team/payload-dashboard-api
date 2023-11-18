#!/bin/sh

docker compose pull
docker compose down
docker compose up -d

# Netcat check with 10-minutes timeout
timeout=600 # 10 minutes in seconds
while ! nc -z app 3000 && [ $timeout -gt 0 ]; do
  sleep 5
  timeout=$((timeout - 5))
done

if [ $timeout -le 0 ]; then
  echo "Application failed after 10 minutes"
  exit 1
fi
