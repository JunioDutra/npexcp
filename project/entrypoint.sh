#!/bin/sh

yarn run typeorm migration:run -- -d dist/datasource.js

yarn run start:prod