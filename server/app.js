require('dotenv').config();
const express = require('express');
const path = require('path');

const controllersFactory = require('./controllers');
const siteRouterFactory = require('./routes');

const app = express();
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  'http://localhost:1234,http://127.0.0.1:1234,http://localhost:1235,http://127.0.0.1:1235'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use((req, res, next) => {
  const origin = req.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.sendStatus(origin && !allowedOrigins.includes(origin) ? 403 : 204);
  }
  next();
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
const imageStatic = express.static(path.join(__dirname, 'images'), {
  dotfiles: 'deny',
  fallthrough: false,
  index: false,
  maxAge: '1d',
});
app.use('/media', imageStatic);
app.use('/readfiles', imageStatic);

const controllers = controllersFactory();
const siteRouter = siteRouterFactory(controllers);
app.use('/api', siteRouter);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  return res.sendFile(path.join(__dirname, 'build', 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      message: 'Image is too large. Maximum file size is 10 MB.',
    });
  }
  return res.status(error.status || 500).json({
    message: error.status && error.status < 500 ? error.message : 'Internal server error',
  });
});

module.exports = app;
