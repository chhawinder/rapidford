import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // To enable cross-origin requests (optional)
import  convertRouter  from "./routes/convert.js"; // Import the conversion route

dotenv.config(); // Load environment variables from the .env file

const app = express();
const corsOptions = {
  origin: 'https://rapidford-6.onrender.com', // Your React app's URL
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


console.log("working...");

// Serve the conversion route
app.use("/convert", convertRouter);

const port = process.env.PORT || 5003; // You can change the port number if needed
// Handle default root request


console.log("listening...");

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
