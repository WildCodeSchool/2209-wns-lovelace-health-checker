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
docker compose -f docker-compose.dev.yml exec back-end npm run test:watch
```

### Run web-app test

Docker and Docker Compose are required on host system.

Make sure you are located on the same folder as the docker-compose.dev.yml file.

```
docker compose -f docker-compose.dev.yml exec web-app npm run test
```

### Run mobile-app with expo

While being in mobile-app folder :

```
npx expo start
```

or

```
npx expo start --tunnel
```

### Tests launched during GitHub CI process

You have to update variables in `push.yml` on each `.env` variable change which impacts tests. If you don't, some of your tests will fail during CI process.

```
name: build-and-test

on: push

env:
  RESET_PASSWORD_EXPIRATION_DELAY: 1800000
  NON_PREMIUM_MAX_AUTHORIZED_REQUESTS: 20 <==== UPDATE HERE
```
