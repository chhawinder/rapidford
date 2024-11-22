import express from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/awsConfig.js";
import { sendToQueue } from "../utils/sqsUtils.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure Multer for temporary storage
const upload = multer({ dest: "uploads/" });

// Route for uploading files to S3 and pushing metadata to SQS queue
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    console.log("File:",req.file);

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }   

    const fileContent = fs.readFileSync(file.path);

    const originalFileName =path.basename(file.path);
    console.log("name:", originalFileName);
    

    const fileExtension = '.docx';  // Extract the extension
    console.log("extension:", fileExtension);
    const fileKey = `${crypto.randomUUID()}${fileExtension}`; // Add the extension

    // console.log(fileContent)
    console.log("File key:", fileKey);
    // Upload file to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileContent,
      ContentType: file.mimetype,
    };
    console.log("Uploading to S3...");

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Push metadata to SQS queue
    const message = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Size: file.size,
      Mimetype: file.mimetype,
    };
    console.log("Pushing metadata to SQS...");

    await sendToQueue(message);

    res.status(200).json({
      message: "File uploaded successfully and pushed to queue.",
      fileDetails: message,
    });
  } catch (err) {
    console.error("Error uploading file or sending to queue:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
