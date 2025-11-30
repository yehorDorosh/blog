import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { environment } from '../../src/environments/environment.js';
import https from 'https';

const s3 = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: environment.r2.accessKeyId,
    secretAccessKey: environment.r2.secretAccessKey,
  },
  endpoint: environment.r2.endpoint,
  requestHandler: new NodeHttpHandler({
    httpsAgent: new https.Agent({
      keepAlive: true,
      maxSockets: 500,
      keepAliveMsecs: 60_000,
    }),
    connectionTimeout: 3000,
    socketTimeout: 5000,
  }),
});

export default s3;
