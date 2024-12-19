import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { IpFilter } from 'express-ipfilter';
import spdy from 'spdy';
import { app as serverEn } from './server/en/server.mjs';
import { app as serverRu } from './server/ru/server.mjs';
import { app as serverUk } from './server/uk/server.mjs';

function run() {
  const port = process.env.PORT || 4000;
  const server = express();

  const limiter = rateLimit({
    windowMs: +(process.env['RATE_LIMIT_WINDOW'] || 10) * 60 * 1000,
    limit: +(process.env['RATE_LIMIT'] || 10000),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  const ips = process.env['IP_BLACK_LIST']?.split(',') ?? [];

  server.use('/uk', serverUk());
  server.use('/ru', serverRu());
  server.use('/en', serverEn());
  server.use('/', serverEn());

  if (process.env.NODE_ENV === 'production') {
    server.use(IpFilter(ips, { log: false }));
    server.use(limiter);
    server.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            'script-src': ["'self'", "'unsafe-inline'"],
          },
        },
      })
    );

    const privateKey = fs.readFileSync('/root/blog/server/security/private.key', 'utf8');
    const certificate = fs.readFileSync('/root/blog/server/security/certificate.crt', 'utf8');
    const ca = fs.readFileSync('/root/blog/server/security/ca_bundle.crt', 'utf8');

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    //spdy HTTP2
    const httpsServer = spdy.createServer(credentials, server);

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