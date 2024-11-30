import express from 'express';
import { app as serverEn } from './server/en/server.mjs';
import { app as serverRu } from './server/ru/server.mjs';
import { app as serverUk } from './server/uk/server.mjs';

function run() {
  const port = process.env.PORT || 4000;
  const server = express();

  server.use('/uk', serverUk());
  server.use('/ru', serverRu());
  server.use('/en', serverEn());
  server.use('/', serverEn());

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();