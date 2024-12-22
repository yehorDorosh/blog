import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, basename } from 'node:path';
import bootstrap from './src/main.server';
import { imageRouter } from './server/router/image-router';
import { LOCALE_ID } from '@angular/core';
import { REQUEST, RESPONSE } from './src/express.tokens';
import admin from 'firebase-admin';
import { environment } from './src/environments/environment';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const lang = basename(serverDistFolder);
  const langPath = `/${lang}/`;
  const browserDistFolder = resolve(serverDistFolder, `../../browser/${lang}`);
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const accessLogStream = fs.createWriteStream(
    path.join(serverDistFolder, '../../../..', 'logs', 'error.log'),
    {
      flags: 'a',
    }
  );

  const commonEngine = new CommonEngine();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: environment.fireBase.projectId,
    });
  }

  server.use((req, res, next) => {
    console.log(req.hostname, req.originalUrl);
    if (req.hostname.startsWith('www.')) {
      const newUrl = `https://${req.hostname.replace('www.', '')}${
        req.originalUrl
      }`;
      res.redirect(301, newUrl);
    } else {
      next();
    }
  });

  // logs
  server.use(
    morgan('combined', {
      stream: accessLogStream,
      skip(req, res) {
        return res.statusCode < 400;
      },
    })
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  server.use('/api', imageRouter);

  // ssl verification
  server.get(
    '/.well-known/pki-validation/BE0CA1297599AF707C91221906681710.txt',
    (req, res) => {
      res.sendFile(
        resolve(
          serverDistFolder,
          '../../../..',
          'server',
          'security',
          'BE0CA1297599AF707C91221906681710.txt'
        )
      );
    }
  );

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    res.set('Content-Language', lang);

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: resolve(serverDistFolder, `../../browser/${lang}/`),
        providers: [
          { provide: APP_BASE_HREF, useValue: langPath },
          { provide: LOCALE_ID, useValue: lang },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req },
        ],
      })
      .then((html) => {
        if (originalUrl.includes('404')) {
          return res.status(404).send(html);
        }
        return res.send(html);
      })
      .catch((err) => next(err));
  });

  server.use(
    (error: unknown, req: Request, res: Response, next: NextFunction) => {
      console.log(error);
      res.status(500).json(error);
    }
  );

  return server;
}

/**
function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
*/
