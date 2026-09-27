import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { IpFilter } from 'express-ipfilter';
// import spdy from 'spdy';
import https from 'https';
import { app as appEn } from './server/en/server.mjs';
import { app as appRu } from './server/ru/server.mjs';
import { app as appUk } from './server/uk/server.mjs';

function run() {
  const port = process.env.PORT || 4000;
  const app = express();

  const limiter = rateLimit({
    windowMs: +(process.env['RATE_LIMIT_WINDOW'] || 10) * 60 * 1000,
    limit: +(process.env['RATE_LIMIT'] || 10000),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  const ips = process.env['IP_BLACK_LIST']?.split(',').map((ip) => ip.trim()).filter(Boolean) ?? [];

  if (process.env.NODE_ENV === 'production') {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            'script-src': ["'self'", "'unsafe-inline'"],
            // Angular SSR loads styles via inline onload handlers
            'script-src-attr': ["'unsafe-inline'"],
            'connect-src': [
              "'self'",
              'https://*.firebasedatabase.app',
              'wss://*.firebasedatabase.app',
              'https://identitytoolkit.googleapis.com',
              'https://securetoken.googleapis.com',
            ],
            'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
            'img-src': ["'self'", 'data:', 'blob:', 'https:'],
            // embeds (YouTube, Google Maps) inside article content
            'frame-src': ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://www.google.com'],
          },
        },
      })
    );
    app.use(
      IpFilter(ips, {
        log: false,
        // Node reports IPv4 clients as ::ffff:x.x.x.x, which never matches plain IPv4 entries
        detectIp: (req) => req.socket.remoteAddress?.replace(/^::ffff:/, '') ?? '',
      })
    );
    app.use(limiter);

    const privateKey = fs.readFileSync('/root/blog/server/security/private.key', 'utf8');
    const certificate = fs.readFileSync('/root/blog/server/security/certificate.crt', 'utf8');
    const ca = fs.readFileSync('/root/blog/server/security/ca_bundle.crt', 'utf8');

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    //spdy HTTP2
    // const httpsServer = spdy.createServer(credentials, server);

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(port, () => {
      console.log(`Node HTTPS server listening on port ${port}`);
    });
  
  } else {
    app.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  }

  app.use('/uk', appUk());
  app.use('/ru', appRu());
  app.use('/en', appEn());
  app.use('/', appEn());
}

run();