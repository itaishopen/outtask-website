FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY libs/shared-types/package.json ./libs/shared-types/
COPY libs/ui/package.json ./libs/ui/
COPY libs/content/package.json ./libs/content/
COPY libs/data-access/package.json ./libs/data-access/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/web ./apps/web
COPY libs/shared-types ./libs/shared-types
COPY libs/ui ./libs/ui
COPY libs/content ./libs/content
COPY libs/data-access ./libs/data-access

RUN cd apps/web && npx ng build --configuration production

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/web/dist/web ./dist

EXPOSE 4000

CMD ["node", "dist/server/server.mjs"]
