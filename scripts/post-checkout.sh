#!/usr/bin/env bash

BASEDIR=$(dirname $(dirname $(realpath $0)))

cd $BASEDIR
pnpm install

find $BASEDIR/backend/prisma/migrations -empty -type d -delete

pnpm --filter backend exec prisma migrate reset -f