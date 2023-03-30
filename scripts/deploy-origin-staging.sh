#!/bin/sh
git fetch origin && git reset --hard origin/staging && git clean -f -d
./build-start.staging.sh