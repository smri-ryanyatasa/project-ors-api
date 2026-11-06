FROM oven/bun:1.2-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]