import express from "express";
import previewRoute from "./routes/preview.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/preview", previewRoute);
const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`Preview Service is running on http://localhost:${port}`);
});
