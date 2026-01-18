# --------------------
# PRUNER
# --------------------
FROM node:lts-alpine AS pruner
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=turborepo-nestjs --docker


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
COPY --from=pruner /app/out/.npmrc ./.npmrc

RUN pnpm install --frozen-lockfile


# --------------------
# BUILDER
# --------------------
FROM node:lts-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

# Build only the NestJS app + deps
RUN pnpm build --filter=turborepo-nestjs...


# --------------------
# RUNNER
# --------------------
FROM node:lts-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

ENV NODE_ENV=production

# Copy only what is needed at runtime
COPY --from=builder /app/apps/turborepo-nestjs/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main.js"]






# FROM node:lts-alpine AS pruner

# WORKDIR /app
# RUN npm install -g turbo
# COPY . .
# RUN turbo prune --scope=turborepo-nestjs --docker


# FROM node:lts-alpine AS installer

# WORKDIR /app
# COPY --from=pruner /app/out/json .
# COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# COPY --from=pruner /app/turbo.json ./turbo.json

# RUN npm install -g pnpm
# RUN pnpm install --frozen-lockfile


# FROM node:lts-alpine AS builder

# WORKDIR /app
# COPY --from=installer /app/ .
# COPY --from=pruner /app/out/full .
# RUN npm install -g pnpm
# RUN pnpm run build


# FROM node:lts-alpine AS runner

# WORKDIR /app
# ENV NODE_ENV=production
# COPY --from=builder /app/ .


# CMD ["node", "apps/turborepo-nestjs/dist/main"]
