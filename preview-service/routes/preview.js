import express from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/awsConfig.js";
import mime from "mime-types";

const router = express.Router();

// Route to stream file from S3
router.get("/:fileKey", async (req, res) => {
  let { fileKey } = req.params;
  fileKey = 'uploads/' + fileKey + '.docx';
  console.log(`[START] Attempting to stream file: ${fileKey}`);

  try {
    console.log("[INFO] Preparing S3 command...");
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    console.log("[INFO] Sending command to S3...");
    const data = await s3.send(command);

    console.log("[INFO] S3 response received. Inferring content type...");
    const extension = fileKey.split(".").pop();
    const inferredContentType =
      mime.lookup(fileKey) ||
      {
        pdf: "application/pdf",
        txt: "text/plain",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }[extension?.toLowerCase()] ||
      "application/octet-stream";

    if (inferredContentType === "application/octet-stream") {
      console.warn("[WARNING] Content-Type could not be determined. Ensure the fileKey has a valid extension.");
    }

    console.log(`[INFO] Inferred Content-Type: ${inferredContentType}`);
    console.log("[INFO] Setting headers...");

    // Set headers
    res.setHeader("Content-Type", inferredContentType);
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Disposition", `inline; filename="${fileKey.split("/").pop()}"`);

    console.log("[INFO] Streaming file to client...");
    data.Body.on("data", (chunk) => {
      res.write(chunk);
      console.log(`[INFO] Streamed chunk of size: ${chunk.length} bytes`);
    });

    data.Body.on("end", () => {
      console.log("[SUCCESS] Finished streaming file.");
      res.end();
    });

    data.Body.on("error", (error) => {
      console.error("[ERROR] Stream error:", error);
      res.status(500).end();
    });
  } catch (error) {
    console.error("[ERROR] Failed to stream file:", error);
    res.status(500).json({ error: "Failed to stream file from S3" });
  }
});

export default router;
