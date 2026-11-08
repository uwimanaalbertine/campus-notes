'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert');

process.env.DB_PATH = ':memory:';

const { createApp } = require('../src/server.js');

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('health endpoint returns a successful response', async () => {
  const res = await fetch(`${base}/health`);

  assert.strictEqual(res.status, 200);

  const body = await res.json();

  assert.strictEqual(body.status, 'ok');
  assert.strictEqual(body.service, 'campus-notes');
  assert.ok(body.timestamp);
});
