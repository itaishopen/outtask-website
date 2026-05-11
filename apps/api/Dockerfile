FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY libs/shared-types/package.json ./libs/shared-types/
COPY libs/jobs/package.json ./libs/jobs/

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN pnpm db:generate

COPY tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs/shared-types ./libs/shared-types
COPY libs/jobs ./libs/jobs

RUN cd apps/api && npx nest build

FROM node:22-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p uploads

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main"]
