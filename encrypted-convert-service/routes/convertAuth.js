import express from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/awsConfig.js';
import fs from 'fs-extra';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import PDFKit from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Helper function to convert a stream to a buffer
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

// Helper function to create PDF from text with encryption
const createEncryptedPDF = (text, password) => {
  return new Promise((resolve, reject) => {
    // Create PDF with encryption
    const doc = new PDFKit({
      userPassword: password,    // Password required to open the document
      ownerPassword: password,   // Password required for owner/full access
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false
      }
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Add text content
    doc.fontSize(12).text(text, {
      width: 500,
      align: 'left',
      lineGap: 5
    });

    // Finalize the PDF
    doc.end();
  });
};

router.post('/:fileKey', async (req, res) => {
  let { fileKey } = req.params;
  const { password } = req.body;
  fileKey = 'uploads/' + fileKey + '.docx';
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // 1. Fetch file from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });
    const data = await s3.send(command);
    const fileBuffer = await streamToBuffer(data.Body);

    // 2. Convert Word to text
    const { value: plainText } = await mammoth.extractRawText({ 
      buffer: fileBuffer
    });

    // 3. Create encrypted PDF directly using PDFKit
    const encryptedPdfBuffer = await createEncryptedPDF(plainText, password);

    // 4. Send response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileKey}.pdf"`);
    res.status(200).send(encryptedPdfBuffer);

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ 
      error: 'Failed to process the file',
      details: error.message 
    });
  }
});

export default router;