
'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('node:path');

const { open } = require('./db.js');
const auth = require('./auth.js');
const notesRouter = require('./notes.js');
const adminRouter = require('./admin.js');
const filesRouter = require('./files.js');
const metrics = require('./metrics.js');
const healthRouter = require('./health.js');

function createApp() {
  const app = express();

  app.locals.db = open();

  // Middleware
  app.use(metrics.middleware);
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Routes
  app.use(metrics.router);
  app.use(healthRouter);
  app.use(auth.router);
  app.use(filesRouter);
  app.use(adminRouter);
  app.use(notesRouter);

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;

  createApp().listen(port, () => {
    console.log(`campus-notes listening on http://0.0.0.0:${port}`);
  });
}

module.exports = { createApp };

