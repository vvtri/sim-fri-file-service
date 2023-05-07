import * as dotenv from 'dotenv';
import { RecursiveKeyOf } from 'shared';
dotenv.config();

const globalConfig = {
  environment: process.env.NODE_ENV,

  auth: {
    accessToken: {
      secret: process.env.AUTH_JWT_ACCESS_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRE,
    },

    refreshToken: {
      secret: process.env.AUTH_JWT_REFRESH_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRE,
    },

    verificationExpires: 86400, // seconds = 24h
  },

  aws: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKet: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET,
  },
};

export default globalConfig;
export type GlobalConfig = Record<RecursiveKeyOf<typeof globalConfig>, string>;
