import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { AbstractStreamableServer } from './abstract-streamable-server.js';

export class StatelessStreamableServer extends AbstractStreamableServer {
  constructor(server: McpServer, port: number) {
    super(server, port);
  }

  protected async postHandler(req: express.Request, res: express.Response) {
    try {
      const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined
      });
      await this.server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      res.on('close', () => {
        console.log('Request closed');
        transport.close();
        this.server.close();
      });
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error'
          },
          id: null
        });
      }
    }
  }

  protected async getHandler(req: express.Request, res: express.Response) {
    console.log('Received GET MCP request');
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed.'
        },
        id: null
      })
    );
  }

  protected async deleteHandler(req: express.Request, res: express.Response) {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed.'
        },
        id: null
      })
    );
  }

  protected async cleanup() {
    console.log('Cleaning up server resources');
  }
}
