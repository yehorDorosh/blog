import { S3Client } from '@aws-sdk/client-s3';
import { environment } from '../../src/environments/environment.js';

const s3 = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: environment.r2.accessKeyId,
    secretAccessKey: environment.r2.secretAccessKey,
  },
  endpoint: environment.r2.endpoint,
});

export default s3;
