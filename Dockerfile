FROM oven/bun

COPY . .

RUN bun install
RUN bun run build

ENV NODE_ENV=production

ENTRYPOINT ["bun",  "run", "server/index.ts"]
