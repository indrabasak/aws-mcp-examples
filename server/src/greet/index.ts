import { GreetServer } from './greet-server.js';
import { StreamableServer } from '../util/streamable-server.js';

async function main() {
  const greetServer = new GreetServer();
  const server = new StreamableServer(greetServer.getServer(), 8080);
  server.connect();
  console.log('Streamable Greet Server is running.');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
