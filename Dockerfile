FROM oven/bun

COPY . .

RUN bun install
RUN bun run build

ENV NODE_ENV=production
ENV DB_URL=./db/db.sqlite

ENTRYPOINT ["bun",  "run", "server/index.ts"]
