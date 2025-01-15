FROM node:22-alpine AS base
FROM base AS builder

WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY src/ src/
RUN npm run build

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base
WORKDIR /app

RUN \
  addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs

COPY --chown=1001:1001 db ./db
COPY --chown=1001:1001 package.json ./
COPY --chown=1001:1001 --from=deps /app/node_modules ./node_modules
COPY --chown=1001:1001 --from=builder /app/dist ./dist

USER nodejs
EXPOSE 3000
ENV NODE_ENV=production

VOLUME ["/app/db"]

CMD ["node", "./dist/index.js"]