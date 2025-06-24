# AWS MCP Examples

A TypeScript serverless application deployed on AWS using the Serverless Framework. This project provides a REST API with `/mcp` endpoints supporting GET, POST, and DELETE operations.

## Features

- **TypeScript**: Fully typed codebase with strict TypeScript configuration
- **Serverless Framework**: Infrastructure as Code using Serverless Framework
- **API Gateway**: RESTful API with CORS support
- **AWS Lambda**: Serverless compute with Node.js 22.x runtime
- **Enterprise Ready**: Configured with IAM permission boundaries for enterprise environments
- **Testing**: Jest testing framework with coverage reports
- **Linting**: ESLint with TypeScript support

## API Endpoints

### GET /mcp
Retrieves MCP resources.

**Query Parameters:**
- `id` (optional): Specific resource ID to retrieve

**Response:**
```json
{
  "success": true,
  "data": [...],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "..."
}
```

### POST /mcp
Creates a new MCP resource.

**Request Body:**
```json
{
  "name": "Resource Name",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-id",
    "name": "Resource Name",
    "description": "Optional description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "..."
}
```

### DELETE /mcp
Deletes an MCP resource by ID.

**Query Parameters:**
- `id` (required): Resource ID to delete

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "resource-id",
    "deleted": true,
    "deletedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "..."
}
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Yarn package manager
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Build the project:
```bash
yarn build
```

### Development

- **Build**: `yarn build`
- **Watch mode**: `yarn watch`
- **Lint**: `yarn lint`
- **Test**: `yarn test`
- **Local development**: `yarn local`

### Deployment

Deploy to development stage:
```bash
yarn deploy:dev
```

Deploy to production stage:
```bash
yarn deploy:prod
```

Remove deployment:
```bash
yarn remove
```

## Project Structure

```
src/
├── handlers/          # Lambda function handlers
│   ├── get-mcp.ts    # GET /mcp handler
│   ├── post-mcp.ts   # POST /mcp handler
│   └── delete-mcp.ts # DELETE /mcp handler
├── types/            # TypeScript type definitions
│   └── api.ts        # API-related types
└── utils/            # Utility functions
    └── response.ts   # Response helper functions
```

## Configuration

The application is configured for enterprise AWS environments with:
- IAM permission boundary: `ADSK-Boundary`
- Region: `us-west-2`
- Node.js runtime: `22.x`
- Memory: 128MB
- Timeout: 30 seconds

## License

MIT 

docker build -t myapp:v1.0 .
docker run -ti myapp:v1.0 sh
docker run --rm -p 8080:8080 myapp:v1.0
node --env-file .env.local dist/client/greet/greet-streamable-client.js