FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_API_BASE_URL

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]
