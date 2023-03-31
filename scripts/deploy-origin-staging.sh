#!/bin/sh
git clean -f -d && git reset --hard HEAD && git checkout staging && git pull
./build-start.prod.sh