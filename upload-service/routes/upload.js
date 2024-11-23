import express from "express";
import multer from "multer";
import { s3 } from "../config/awsConfig.js";
import path from "path";
import crypto from 'crypto';
import multerS3 from 'multer-s3';

const router = express.Router();

// Configure multer-s3 for direct uploads to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const fileKey = `uploads/${crypto.randomUUID()}${fileExtension}`;
      cb(null, fileKey);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit, adjust as needed
  }
});

// Route for uploading files to S3
router.post("/", upload.single("file"), async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  try {
    console.log("Received request to upload file.");

    const file = req.file;
    console.log("File received:", file);

    if (!file) {
      console.log("No file uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    // With multer-s3, the file is already uploaded to S3 at this point
    // The file object contains useful metadata
    const fileDetails = {
      bucket: process.env.AWS_S3_BUCKET_NAME,
      key: file.key,
      location: file.location, // The S3 URL of the uploaded file
      size: file.size,
      mimetype: file.mimetype,
      etag: file.etag
    };

    console.log("File successfully uploaded to S3:", fileDetails);

    // If you want to send to SQS, you can do it here
    // await sendToQueue(fileDetails);
    if(req.method === 'OPTIONS'){
      return res.status(204).send('');
      next();
    }
    res.status(200).json({
      message: "File uploaded successfully",
      fileDetails
    });

  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ 
      error: "Internal server error",
      message: err.message 
    });
  }
});

export default router;
