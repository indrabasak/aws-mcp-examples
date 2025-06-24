import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';

export abstract class AbstractStreamableServer {
  protected server: McpServer;
  private app!: express.Express;
  private readonly port;

  constructor(server: McpServer, port: number) {
    this.server = server;
    this.port = port;
    console.log('Creating Express app...');
    this.app = express();
    this.app.use(express.json());
    this.app.post('/mcp', this.postHandler.bind(this));
    this.app.get('/mcp', this.getHandler.bind(this));
    this.app.delete('/mcp', this.deleteHandler.bind(this));
    this.app.get('/', (req, res) => {
      console.log('Received request to /');
      res.json({
        message: 'Hello from Express with Lambda Web Adapter!',
        timestamp: new Date().toISOString()
      });
    });
  }

  public connect() {
    const expressServer = this.app.listen(this.port, () => {
      console.log(`MCP Streamable HTTP Server listening on port ${this.port}`);
    });

    // Add server event listeners for better visibility
    expressServer.on('connect', (transport) => {
      console.log(`[Server] Transport connected: ${transport}`);
    });

    expressServer.on('disconnect', (transport) => {
      console.log(`[Server] Transport disconnected: ${transport.sessionId}`);
    });

    expressServer.on('request', (request, transport) => {
      // console.log(transport);
      console.log(`[Server] Received request: ${request.method} from transport`);
    });

    expressServer.on('response', (response, transport) => {
      console.log(
        `[Server] Sending response for id: ${response.id} to transport: ${transport.sessionId}`
      );
    });

    expressServer.on('notification', (notification, transport) => {
      console.log(
        `[Server] Sending notification: ${notification.method} to transport: ${transport.sessionId}`
      );
    });

    expressServer.on('error', (error: any, transport: any) => {
      console.error(`[Server] Error with transport ${transport?.sessionId || 'unknown'}:`, error);
    });

    // Handle server shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');

      await this.cleanup();
      await expressServer.close();
      await this.server.close();
      console.log('Server shutdown complete');
      process.exit(0);
    });
  }

  protected abstract cleanup(): Promise<void>;

  protected abstract postHandler(req: express.Request, res: express.Response): Promise<void>;

  protected abstract getHandler(req: express.Request, res: express.Response): Promise<void>;

  protected abstract deleteHandler(req: express.Request, res: express.Response): Promise<void>;
}
