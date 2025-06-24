import { StreamableClient } from '../util/streamable-client.js';

export class StreamableHelloClient extends StreamableClient {
  constructor() {
    super(
      'Greet Streamable Hello Client',
      '1.0.0',
      'https://2wpusa07k4.execute-api.us-west-2.amazonaws.com/mcp'
    );
  }
}

async function main() {
  const client = new StreamableHelloClient();
  await client.connect();
  console.log('Streamable Hello Client is running.');
  await client.listTools();
  await client.callTool('greet', { name: 'Indra' });
  await client.callTool('multi-greet', { name: 'Indra' });
  await client.quit();
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
