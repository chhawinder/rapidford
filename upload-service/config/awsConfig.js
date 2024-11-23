import { S3Client } from "@aws-sdk/client-s3";
// import { SQSClient } from "@aws-sdk/client-sqs";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from "dotenv";
// import AWS from 'aws-sdk';
// Load environment variables
dotenv.config();

// S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// SQS client
// const sqs = new SQSClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

export { s3 };
