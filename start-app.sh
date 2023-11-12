#!/bin/sh

set -e

/wait-for-graylog.sh graylog

echo "Starting app"
npm run dev
