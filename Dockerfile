ARG NODE_IMAGE=node:20-alpine

FROM $NODE_IMAGE AS base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
USER root
RUN npm install
COPY --chown=node:node . .

CMD npm run dev