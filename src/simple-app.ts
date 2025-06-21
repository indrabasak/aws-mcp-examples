import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

console.log('Creating Express app...');

// SIGTERM Handler
process.on('SIGTERM', async () => {
  console.info('[express] SIGTERM received');

  console.info('[express] cleaning up');
  // perform actual clean up work here.
  await new Promise(resolve => setTimeout(resolve, 100));

  console.info('[express] exiting');
  process.exit(0)
});

app.get('/', (req, res) => {
  console.log('Received request to /');
  res.json({ message: 'Hello from Express with Lambda Web Adapter!', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  console.log('Received request to /health');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/xyz', (req, res) => {
  console.log('Received request to /xyz');
  res.json({ message: 'XYZ endpoint working!', timestamp: new Date().toISOString() });
});

console.log(`Starting Express server on port ${port}...`);
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
