# Health Check

## Development environment

### Integrate with coding tools

Install dependencies on host system to get autocomplete and other IDE features:

```
cd back-end && npm i && cd ..
cd web-app && npm i && cd ..
```

### Run app

Docker and Docker Compose are required on host system.

Rename `.env-sample` to `.env` and set all required values.

Build and start in dev mode:

```
./build-start.dev.sh
```

### Run back-end test

Docker and Docker Compose are required on host system.

Make sure you are located on the same folder as the docker-compose.dev.yml file, and that the line `"exclude": ["**/*.test.ts", "**/*.spec.ts", "**/*.mock.ts"]` is NOT commented on the tsconfig.json file.

```
docker compose -f docker-compose.dev.yml exec back-end npm run test
```

### Run web-app test

Docker and Docker Compose are required on host system.

Make sure you are located on the same folder as the docker-compose.dev.yml file.

```
docker compose -f docker-compose.dev.yml exec web-app npm run test
```
