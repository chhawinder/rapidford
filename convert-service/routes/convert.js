import express from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/awsConfig.js';
import fs from 'fs-extra';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import PDFKit from 'pdfkit';

import { fileURLToPath } from 'url';

const router = express.Router();

// Helper function to convert a stream to a buffer
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

// Route to convert Word file to PDF
router.get('/:fileKey', async (req, res) => {
  let { fileKey } = req.params;
  fileKey = 'uploads/' + fileKey + '.docx';
  console.log(`[START] Fetching file: ${fileKey}`);

  try {
    // Fetch the Word file from S3
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };

    const command = new GetObjectCommand(getObjectParams);
    const data = await s3.send(command);
    console.log(`[INFO] Successfully fetched file from S3: ${fileKey}`);

    // Convert the S3 object (Word file) to a buffer
    const fileBuffer = await streamToBuffer(data.Body);
    console.log(`[INFO] Buffer created successfully, size: ${fileBuffer.length} bytes`);

    // Save the buffer as a temporary Word file

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tempInputPath = path.join(__dirname, 'tempInput.docx');
    await fs.writeFile(tempInputPath, fileBuffer);
    console.log(`[SUCCESS] File saved to: ${tempInputPath}`);





    // const tempInputPath = path.join(__dirname, 'tempInput.docx');
    // await fs.writeFile(tempInputPath, fileBuffer);
    // console.log(`[SUCCESS] File saved to: ${tempInputPath}`);

    // Convert Word document to plain text using Mammoth
    const { value: plainText } = await mammoth.extractRawText({ path: tempInputPath });
    console.log(`[INFO] Successfully extracted text`);

    // Create a PDF using PDFKit
    const doc = new PDFKit();
    const pdfBuffer = [];
    doc.on('data', (chunk) => pdfBuffer.push(chunk));
    doc.on('end', () => {
      const pdfData = Buffer.concat(pdfBuffer);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileKey}.pdf"`);
      res.status(200).send(pdfData);
      console.log(`[SUCCESS] PDF sent to client successfully`);
    });

    doc.fontSize(12).text(plainText, {
      width: 410,
      align: 'left',
      continued: true
    });

    doc.end(); // Finalize the PDF document

  } catch (err) {
    console.error(`[ERROR] Error fetching or processing file: ${err.message}`);
    res.status(500).json({ error: 'Failed to process the request' });
  }
});

export default router;
