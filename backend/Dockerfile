# [NOTE] Build image from the root directory of this repository.
# ex) `docker build -f backend/Dockerfile .`

### BUILDER ###
FROM node:20.13.1-alpine AS builder

COPY . /build
WORKDIR /build

RUN corepack enable
RUN pnpm --filter=backend deploy out

WORKDIR /build/out
RUN npx prisma generate
RUN npm run build

### PRODUCTION ###
FROM node:20.13.1-alpine

ENV NODE_ENV=production

COPY --from=builder /build/out /app
COPY ./backend/entrypoint.sh /app
WORKDIR /app

ENTRYPOINT ["/app/entrypoint.sh"]
