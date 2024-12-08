import { Readable } from 'stream';
import {
  GetObjectCommand,
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { environment } from '../../src/environments/environment.js';
import { RequestHandler } from 'express';
import fs from 'fs';

// Cloudflare R2 Storage
const s3 = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: environment.r2.accessKeyId,
    secretAccessKey: environment.r2.secretAccessKey,
  },
  endpoint: environment.r2.endpoint,
});

export const getImage: RequestHandler = async (req, res) => {
  const command = new GetObjectCommand({
    Bucket: 'blog',
    Key: `${req.params['id']}/${req.params['key']}`,
  });

  try {
    const { Body, ContentType } = await s3.send(command);

    if (Body instanceof Readable) {
      res.writeHead(200, {
        'Content-Type': ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=60',
        ETag: req.params['key'],
      });
      Body.pipe(res);
    } else {
      res.status(500).send('Error fetching image');
    }
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).send('Error fetching image');
  }
};

export const uploadImage: RequestHandler = async (req, res, next) => {
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
};

export const getImageList: RequestHandler = async (req, res) => {
  const listParams = {
    Bucket: 'blog',
    Prefix: req.params['id'],
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
};

export const deleteImage: RequestHandler = async (req, res) => {
  let command;
  if (!req.params['key']) {
    const listParams = {
      Bucket: 'blog',
      Prefix: req.params['id'],
    };

    try {
      const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

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
      Key: `${req.params['id']}/${req.params['key']}`,
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
};
