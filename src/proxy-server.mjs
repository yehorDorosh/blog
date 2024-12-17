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

  if (process.env.NODE_ENV === 'production') {
    const privateKey = fs.readFileSync('/root/blog/server/security/private.key', 'utf8');
    const certificate = fs.readFileSync('/root/blog/server/security/certificate.crt', 'utf8');
    const ca = fs.readFileSync('/root/blog/server/security/ca_bundle.crt', 'utf8');

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    const httpsServer = https.createServer(credentials, server);

    httpsServer.listen(port, () => {
      console.log(`Node HTTPS server listening on port ${port}`);
    });
  
  } else {
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  }
}

run();