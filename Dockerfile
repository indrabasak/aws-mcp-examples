#FROM public.ecr.aws/docker/library/node:16.13.2-stretch-slim
#
#COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
#EXPOSE 8080
#WORKDIR "/var/task"
#ADD src/package.json /var/task/package.json
#ADD src/package-lock.json /var/task/package-lock.json
#RUN npm install --omit=dev
#ADD src/ /var/task
#CMD ["node", "index.js"]

# FROM public.ecr.aws/lambda/nodejs:20 AS builder
FROM public.ecr.aws/docker/library/node:20-slim

# Copy Lambda Web Adapter
#COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.2 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
# COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1-x86_64 /lambda-adapter /opt/extensions/lambda-adapter

EXPOSE 8080

## Set the working directory
#WORKDIR ${LAMBDA_TASK_ROOT}
WORKDIR "/var/task"

## Enable Corepack for Yarn 4 support
RUN corepack enable


#
# Copy TypeScript configuration and source files
COPY tsconfig.json ./
COPY src ./src

# Copy package management files first for better layer caching
COPY package.json ./
COPY yarn.lock ./
#COPY .yarn ./.yarn

RUN echo $(ls -la)

RUN npm install -g typescript

## Install all dependencies (including dev dependencies for building)
RUN yarn install --immutable

# Build the TypeScript code
RUN yarn build

# Copy the built application from builder stage
#COPY --from=builder ${LAMBDA_TASK_ROOT}/dist ./dist

#
# Copy the package.json for ES module support
COPY package.json ./dist/

# Copy package files
#COPY package*.json ./
#COPY yarn.lock ./

# Install dependencies
#RUN npm install --production

## Copy application files
#COPY dist/ ./dist/
#COPY run.sh ./run.sh
#
## Make run.sh executable
#RUN chmod +x run.sh

# Set the Lambda handler
CMD ["node", "dist/simple-app"]

#
# Multi-stage build for minimal Lambda image size

# Build stage - includes dev dependencies for TypeScript compilation
#FROM public.ecr.aws/lambda/nodejs:22-arm64 AS builder
#
## Set the working directory
#WORKDIR ${LAMBDA_TASK_ROOT}

## Enable Corepack for Yarn 4 support
#RUN corepack enable
#
## Copy package management files first for better layer caching
#COPY package.json yarn.lock .yarnrc.yml ./
#COPY .yarn ./.yarn
#
## Install all dependencies (including dev dependencies for building)
#RUN yarn install --immutable
#
## Copy TypeScript configuration and source files
#COPY tsconfig.json ./
#COPY src ./src
#
## Build the TypeScript code
#RUN yarn build
#
## Production stage - minimal runtime image
#FROM public.ecr.aws/lambda/nodejs:22-arm64 AS runtime
#
## Set the working directory
#WORKDIR ${LAMBDA_TASK_ROOT}
#
## Enable Corepack for Yarn 4 support
#RUN corepack enable
#
## Copy package management files
#COPY package.json yarn.lock .yarnrc.yml ./
#COPY .yarn ./.yarn
#
## Install only production dependencies
#RUN yarn install --immutable && \
#    yarn cache clean && \
#    rm -rf .yarn/cache .yarn/unplugged .yarn/build-state.yml .yarn/install-state.gz
#
## Copy the built application from builder stage
#COPY --from=builder ${LAMBDA_TASK_ROOT}/dist ./dist
#
## Copy the package.json for ES module support
#COPY package.json ./dist/
#
## Remove package management files to save space
#RUN rm -f package.json yarn.lock .yarnrc.yml && \
#    rm -rf .yarn
#
## Set the CMD to the handler (ESM format)
#CMD ["dist/handler.default"]