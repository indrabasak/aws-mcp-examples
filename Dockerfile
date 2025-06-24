FROM public.ecr.aws/docker/library/node:20-slim

# Copy Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

EXPOSE 8080

## Set the working directory
WORKDIR "/var/task"

## Enable Corepack for Yarn 4 support
RUN corepack enable

#RUN npm install -g yarn

# Install TypeScript globally
RUN npm install -g typescript

# Copy TypeScript configuration and source files
COPY tsconfig.json ./
COPY src ./src

# Copy package management files
COPY package.json ./
COPY yarn.lock ./

## Install all dependencies (including dev dependencies for building)
RUN yarn install

# Build the TypeScript code
RUN yarn build

# Set the Lambda handler
#CMD ["node", "dist/simple-app"]
CMD ["node", "dist/server/greet/stateless-index.js"]
