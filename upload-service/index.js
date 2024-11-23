// import React, { useState } from 'react';
// import './App.css';

// function App() {
//   const [file, setFile] = useState(null); // To store the selected file
//   const [responseMessage, setResponseMessage] = useState(null); // To display response message
//   const [fileKey, setFileKey] = useState(null); // To store the file key after uploading
//   const [fileUrl, setFileUrl] = useState(null); // To store the file URL for preview

//   // Handle file selection
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]); // Store the selected file
//   };

//   // Handle file upload
//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file to upload.");
//       return;
//     }

//     const formData = new FormData(); // Create a FormData object to send the file
//     formData.append('file', file);  // Append the file to FormData

//     try {
//       // Sending the file as multipart/form-data to the backend
//       const response = await fetch('http://localhost:5001/upload', {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//         },
//         body: formData,  // Send the FormData with the file
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setFileKey(data.fileKey); // Store the file key from the response
//         setFileUrl(data.fileUrl); // Set the file URL from the response for preview
//         setResponseMessage(`File uploaded successfully.`);
//       } else {
//         setResponseMessage(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       setResponseMessage(`Error: ${error.message}`);
//     }
//   };

//   // Render preview of the uploaded document
//   const handlePreview = () => {
//     if (!fileUrl) {
//       alert("No file URL available for preview.");
//       return;
//     }

//     // Displaying the Word file preview in an iframe using Google Docs Viewer
//     return (
//       <div className="preview-container">
//         <h3>Document Preview</h3>
//         <iframe
//           src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
//           width="600"
//           height="400"
//           frameBorder="0"
//           title="Document Preview"
//         ></iframe>
//       </div>
//     );
//   };

//   return (
//     <div className="App">
//       <h1>File Upload to S3</h1>

//       {/* File input */}
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload File</button>

//       {/* Display the response message */}
//       {responseMessage && <p>{responseMessage}</p>}

//       {/* Preview Button */}
//       {fileKey && (
//         <button onClick={handlePreview}>Preview File</button>
//       )}

//       {/* Display the document preview */}
//       {fileUrl && handlePreview()}
//     </div>
//   );
// }

// export default App;



import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // To enable cross-origin requests (optional)
import  uploadserver  from "./routes/upload.js"; // Import the conversion route

dotenv.config(); // Load environment variables from the .env file

const app = express();

const allowedDomain = 'https://rapidford-6.onrender.com/';

app.use(express.json());
// Configure CORS
app.use(cors({
    origin: '*', // Only allow this domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed in requests
    credentials: true // Enable credentials sharing if needed
}));

 // Parse incoming JSON requests

console.log("working...");

// Serve the conversion route
app.use("/upload", uploadserver);

const port = process.env.PORT || 5001; // You can change the port number if needed
// Handle default root request


console.log("listening...");

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
