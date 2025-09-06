FROM node:22-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS deps
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=deps /app/.next ./.next
COPY --from=deps /app/public ./public
COPY --from=deps /app/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]