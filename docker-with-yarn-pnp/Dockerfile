FROM alpine AS base

RUN apk --no-cache add yarn


FROM base AS deps

WORKDIR /workspace

COPY package.json yarn.lock .yarnrc.yml .
COPY .yarn .yarn

RUN yarn workspaces focus --production


FROM deps AS build

WORKDIR /workspace

RUN yarn install --immutable

ENV NODE_ENV=production

COPY . .
RUN yarn build


FROM base AS pack

COPY --from=deps /workspace /pack
COPY --from=build /workspace/build /pack/build
COPY --from=build /workspace/public /pack/public


FROM base AS prod

RUN apk --no-cache add nodejs

COPY --from=pack /pack /opt/app

WORKDIR /opt/app

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start"]
