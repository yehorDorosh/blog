import { Readable } from 'stream';
import {
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { environment } from '../../src/environments/environment.js';
import { RequestHandler } from 'express';
import fs from 'fs';
import s3 from './s3-client'; // Cloudflare R2 Storage

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
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.error(
      `${new Date().getDate()}-${new Date().getMonth()} Error fetching image: ${
        req.params['id']
      }/${req.params['key']}`,
      clientIp
    );
    console.error(err);
    res.status(500).send('Error fetching image');
  }
};

export const uploadImage: RequestHandler = async (req, res) => {
  const articleId = req.query['id'] as string;
  const file = req.file;

  if (!file) {
    return res.status(422).send('No file uploaded.');
  }

  // Multer's temp file must go away whatever happens with the upload
  const removeTempFile = () =>
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error removing temp file:', err);
    });

  if (!articleId) {
    removeTempFile();
    return res.status(422).send('No file uploaded.');
  }

  try {
    const command = new PutObjectCommand({
      Bucket: environment.r2.bucket,
      Key: `${articleId}/${file.originalname}`,
      Body: fs.readFileSync(file.path),
      ContentType: file.mimetype,
    });
    const response = await s3.send(command);
    return res.send(response);
  } catch (err) {
    console.error('Error uploading file:', err);
    return res.status(500).send('Error uploading file.');
  } finally {
    removeTempFile();
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
