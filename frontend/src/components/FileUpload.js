import express from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/awsConfig.js';
import fs from 'fs';
import path from 'path';
import libre from 'libreoffice-convert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const { fileKey } = req.params;
  console.log(`Fetching file: ${fileKey}`);

  try {
    // Fetch the Word file from S3
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };

    const command = new GetObjectCommand(getObjectParams);
    const data = await s3.send(command);

    // Convert the S3 object (Word file) to a buffer
    const fileBuffer = await streamToBuffer(data.Body);

    // Save the buffer as a temporary Word file
    const tempInputPath = path.join(__dirname, 'tempInput.docx');
    fs.writeFileSync(tempInputPath, fileBuffer);

    // Convert the Word file to PDF using libreoffice-convert
    const tempOutputPath = path.join(__dirname, 'outputFile.pdf');
    const extend = '.pdf'; // Target format

    const inputFile = fs.readFileSync(tempInputPath);
    libre.convert(inputFile, extend, undefined, (err, pdfBuffer) => {
      if (err) {
        console.error(`Error converting file: ${err}`);
        res.status(500).json({ error: 'Failed to convert Word to PDF' });
        return;
      }

      // Delete the temporary input file
      fs.unlinkSync(tempInputPath);

      // Save the PDF buffer as a temporary file for debugging (optional)
      fs.writeFileSync(tempOutputPath, pdfBuffer);

      // Set the response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileKey}.pdf"`);
      res.status(200).send(pdfBuffer);

      // Cleanup the generated PDF after sending it
      fs.unlinkSync(tempOutputPath);

      console.log('Success: PDF generated and sent to the client.');
    });
  } catch (err) {
    console.error('Error fetching or processing file:', err);
    res.status(500).json({ error: 'Failed to process the request' });
  }
});

export default router;
