#!/bin/sh
docker compose -f ../docker-compose.dev.yml exec back-end npm run test:watch