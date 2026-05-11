FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/admin/package.json ./apps/admin/
COPY libs/shared-types/package.json ./libs/shared-types/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/admin ./apps/admin
COPY libs/shared-types ./libs/shared-types

RUN cd apps/admin && npx ng build --configuration production

FROM nginx:alpine AS runner

COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/admin/dist/admin/browser /usr/share/nginx/html

EXPOSE 80
