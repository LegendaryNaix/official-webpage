#!/bin/sh
npx prisma migrate deploy
node /app/dist/app/main.js
