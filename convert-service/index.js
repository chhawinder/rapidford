import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // To enable cross-origin requests (optional)
import  convertRouter  from "./routes/convert.js"; // Import the conversion route

dotenv.config(); // Load environment variables from the .env file

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all origins (optional)
app.use(express.json()); // Parse incoming JSON requests

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
