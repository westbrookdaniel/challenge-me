FROM oven/bun

RUN bun install
RUN bun run build

COPY . .

ENV NODE_ENV=production

ENTRYPOINT ["bun",  "run", "server/index.ts"]
