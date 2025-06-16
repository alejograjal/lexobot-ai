FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend-admin/package.json frontend-admin/package-lock.json ./
RUN npm ci

COPY frontend-admin .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
