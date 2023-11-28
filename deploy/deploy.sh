#!/bin/sh

docker compose pull app
docker compose up -d --no-deps app
