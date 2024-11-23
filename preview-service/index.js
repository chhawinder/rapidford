import express from "express";
import previewRoute from "./routes/preview.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const allowedDomain = 'https://rapidford-5sgy.vercel.app/';

// Configure CORS
app.use(cors({
    origin: allowedDomain, // Only allow this domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed in requests
    credentials: true // Enable credentials sharing if needed
}));
// Middleware setup
app.use(express.json());

app.use("/preview", previewRoute);
const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`Preview Service is running on http://localhost:${port}`);
});
