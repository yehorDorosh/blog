import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import multer from 'multer';
import fs from 'fs';
import { Readable } from 'stream';
import { environment } from './src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  // Cloudflare R2 Storage
  const s3 = new S3Client({
    region: 'auto',
    credentials: {
      accessKeyId: environment.r2.accessKeyId,
      secretAccessKey: environment.r2.secretAccessKey,
    },
    endpoint: environment.r2.endpoint,
  });

  // Configure multer for file handling
  // create folder if it doesn't exist
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname);
    },
  });

  const upload = multer({ storage: storage });

  // API Endpoints
  // Endpoint to upload an image
  server.post(
    '/api/upload-image',
    upload.single('image'),
    async (req, res, next) => {
      const articleId = req.query['id'] as string;

      if (!req.file || !articleId) {
        return res.status(422).send('No file uploaded.');
      }

      const fileContent = fs.readFileSync(req.file.path);

      const command = new PutObjectCommand({
        Bucket: environment.r2.bucket,
        Key: `${articleId}/${req.file.originalname}`,
        Body: fileContent,
        ContentType: req.file.mimetype,
      });

      try {
        const response = await s3.send(command);
        fs.unlink(req.file.path, (err) => {
          next(err);
        });
        return res.send(response);
      } catch (err) {
        console.error('Error uploading file:', err);
        return res.status(500).send('Error uploading file.');
      }
    }
  );

  server.get('/api/image/:id/:key', async (req, res) => {
    const command = new GetObjectCommand({
      Bucket: 'blog',
      Key: `${req.params.id}/${req.params.key}`,
    });

    try {
      const { Body, ContentType } = await s3.send(command);

      if (Body instanceof Readable) {
        res.writeHead(200, {
          'Content-Type': ContentType || 'application/octet-stream',
        });
        Body.pipe(res);
      } else {
        res.status(500).send('Error fetching image');
      }
    } catch (err) {
      console.error('Error fetching image:', err);
      res.status(500).send('Error fetching image');
    }
  });

  server.get('/api/image/:id', async (req, res) => {
    const listParams = {
      Bucket: 'blog',
      Prefix: req.params.id,
    };

    try {
      const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        return res.status(404).send('No object found');
      }

      const images = listedObjects.Contents.map((object) => object.Key);
      return res.send(images);
    } catch (err) {
      console.error('Error when getting list of articles imgs', err);
      return res.status(500).send('Error when getting list of articles imgs.');
    }
  });

  server.delete('/api/image/:id/:key?', async (req, res) => {
    let command;
    if (!req.params.key) {
      const listParams = {
        Bucket: 'blog',
        Prefix: req.params.id,
      };

      try {
        const listedObjects = await s3.send(
          new ListObjectsV2Command(listParams)
        );

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
          return res.status(404).send('No object found');
        }

        command = new DeleteObjectsCommand({
          Bucket: 'blog',
          Delete: {
            Objects: listedObjects.Contents.map((object) => ({
              Key: object.Key,
            })),
            Quiet: true,
          },
        });
      } catch (err) {
        console.error('Error deleting image:', err);
        res
          .status(500)
          .send('Error deleting image. When trying to get list objects.');
      }
    } else {
      command = new DeleteObjectCommand({
        Bucket: 'blog',
        Key: `${req.params.id}/${req.params.key}`,
      });
    }

    try {
      if (command && command instanceof DeleteObjectCommand) {
        const response = await s3.send(command);
        return res.send(response);
      } else if (command && command instanceof DeleteObjectsCommand) {
        const response = await s3.send(command);
        return res.send(response);
      } else {
        return res.status(500).send('Error deleting image. No command.');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      return res.status(500).send('Error deleting image');
    }
  });

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
