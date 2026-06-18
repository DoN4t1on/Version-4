const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

process.env.CORS_ORIGINS = 'https://allowed.example';

const app = require('../app');

let baseUrl;
let server;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('health endpoint reports service availability', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('CORS allows configured origins', async () => {
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Origin: 'https://allowed.example' },
  });

  assert.equal(response.headers.get('access-control-allow-origin'), 'https://allowed.example');
});

test('CORS does not reflect unconfigured origins', async () => {
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Origin: 'https://blocked.example' },
  });

  assert.equal(response.headers.get('access-control-allow-origin'), null);
});

test('unknown API routes return JSON 404 responses', async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { message: 'Route not found' });
});

test('protected routes reject missing tokens', async () => {
  const response = await fetch(`${baseUrl}/api/post/uploadPost`, {
    method: 'POST',
  });

  assert.equal(response.status, 401);
});

test('comment list validates post identifiers before querying', async () => {
  const response = await fetch(`${baseUrl}/api/post/getComments/not-a-post-id`);

  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), { message: 'Id must be a valid identifier' });
});

test('single suggestion validates post identifiers before querying', async () => {
  const response = await fetch(`${baseUrl}/api/post/getOneSuggestion/not-a-post-id`);

  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), { message: 'Id must be a valid identifier' });
});
