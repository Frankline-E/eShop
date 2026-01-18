# --------------------
# PRUNER
# --------------------
FROM node:lts-alpine AS pruner
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=user-ui --docker


# --------------------
# INSTALLER
# --------------------
FROM node:lts-alpine AS installer
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
#COPY --from=pruner /app/out/.npmrc ./.npmrc

RUN pnpm install --frozen-lockfile


# --------------------
# BUILDER
# --------------------
FROM node:lts-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

ARG TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TEAM=${TURBO_TEAM}
ENV TURBO_TOKEN=${TURBO_TOKEN}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

RUN pnpm build --filter=user-ui...


# --------------------
# RUNNER
# --------------------
FROM node:lts-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

ENV NODE_ENV=production

COPY --from=builder /app/apps/user-ui ./apps/user-ui
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/apps/user-ui
EXPOSE 3000

CMD ["pnpm", "start"]







# FROM node:lts-alpine AS pruner

# WORKDIR /app
# RUN npm install -g turbo
# COPY . .
# RUN turbo prune --scope=user-ui --docker


# FROM node:lts-alpine AS installer

# WORKDIR /app
# COPY --from=pruner /app/out/json .
# COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# COPY --from=pruner /app/turbo.json ./turbo.json

# RUN npm install -g pnpm
# RUN pnpm install --frozen-lockfile


# FROM node:lts-alpine AS builder

# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
# WORKDIR /app
# COPY --from=installer /app/ .
# COPY --from=pruner /app/out/full .
# RUN npm install -g pnpm
# RUN pnpm run build


# FROM node:lts-alpine AS runner

# WORKDIR /app
# ENV NODE_ENV=production
# RUN npm install -g pnpm
# COPY --from=builder /app/ .
# WORKDIR /app/apps/user-ui

# CMD ["pnpm", "start"]
