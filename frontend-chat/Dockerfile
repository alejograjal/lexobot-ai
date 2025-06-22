FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ENV

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 

EXPOSE 3000

CMD ["node", "server.js"]
