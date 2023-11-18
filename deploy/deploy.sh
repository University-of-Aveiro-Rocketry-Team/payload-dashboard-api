#!/bin/sh

docker compose pull
docker compose down
docker compose up -d

# Netcat check with 10-minutes timeout
timeout=600  # 10 minutes
port=3000    # main app service port

until nc -z localhost $port || [ $timeout -eq 0 ]; do
  >&2 echo "Service is unavailable - sleeping"
  sleep 5
  timeout=$((timeout-5))
done

if [ $timeout -eq 0 ]; then
  >&2 echo "App did not become available after 10 minutes"
  exit 1
fi

>&2 echo "App is up"

