FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_API_LEXOBOT_URL

ENV NEXT_PUBLIC_API_LEXOBOT_URL=$NEXT_PUBLIC_API_LEXOBOT_URL

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
