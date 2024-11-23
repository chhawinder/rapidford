import express from "express";
import previewRoute from "./routes/preview.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const corsOptions = {
  origin: '*', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
};

// Apply CORS middleware with options

app.use(cors(corsOptions));
// Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});


app.use("/preview", previewRoute);
const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`Preview Service is running on http://localhost:${port}`);
});
