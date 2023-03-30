#!/bin/sh
docker compose -f docker-compose.dev.yml exec web-app npm run test