require('dotenv').config();
const http = require('http');
const app = require('./app');
const database = require('./config/database');
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = Number(process.env.PORT || API_PORT || 5009);

const start = async () => {
  await database.connect();
  server.listen(port, () => {
  });
};

const shutdown = async (signal) => {
  server.close(async () => {
    await database.disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((error) => {
  console.error('Server startup failed', error);
  process.exit(1);
});
