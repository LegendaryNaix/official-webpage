#!/usr/bin/env bash

set -ex

# Check requirements: npm
if [ ! $(command -v npm) ]
then
  echo "Error: npm is not installed. Please install npm first."
  exit 1
fi

BASEDIR=$(dirname $(dirname $(realpath $0)))

cd $BASEDIR

# If dotenv schema is not updated, remove the file
if [ -f backend/.env ] && grep -q DATABASE_URL backend/.env
then
  rm backend/.env
fi

# If .env does not exist, create one
if [ ! -f backend/.env ]
then
  echo "NODEMAILER_HOST=\"email-smtp.ap-northeast-2.amazonaws.com\"" >> backend/.env
  echo "NODEMAILER_USER=\"\"" >> backend/.env
  echo "NODEMAILER_PASS=\"\"" >> backend/.env
  echo "NODEMAILER_FROM=\"\"" >> backend/.env
  echo "CLOUDFRONT_ID_KEY=\"\"" >> backend/.env
  echo "CLOUDFRONT_SECRET_KEY=\"\"" >> backend/.env
  echo "JWT_SECRET=$(head -c 64 /dev/urandom | LC_ALL=C tr -dc A-Za-z0-9 | sha256sum | head -c 64)" >> backend/.env
fi

# Install pnpm and Node.js packages
npm install -g pnpm@latest
pnpm install

# Enable git auto completion
if ! grep -q "bash-completion/completions/git" ~/.bashrc
then
  echo "source /usr/share/bash-completion/completions/git" >> ~/.bashrc
fi

# Apply database migration
for i in {1..5}
do
  pnpm --filter backend exec prisma migrate reset -f && break # break if migration succeed
  echo -e '\n⚠️ Failed to migrate. Waiting for db to be ready...\n'
  sleep 5
done

# Setup Minio
pnpm exec ts-node scripts/setup-minio.ts