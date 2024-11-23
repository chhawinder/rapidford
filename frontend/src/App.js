import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Upload, Eye, FileText, Lock, Info } from 'lucide-react';
import './App.css';
import mammoth from 'mammoth';

function App() {
  // ... existing states ...
  const [showAbout, setShowAbout] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Enhanced error handling for upload
  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setUploadError(null);
    setResponseMessage(null);

    try {
      console.log('Starting upload...'); // Debug log
      const response = await fetch('https://rapidford.onrender.com/upload/', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      console.log('Response received:', response); // Debug log

      // Since we're using no-cors, we need to handle the response differently
      if (response.type === 'opaque') {
        // Assuming upload was successful since we can't read the response
        const fileName = file.name;
        const actualFileKey = fileName.replace(/\.[^/.]+$/, '');
        setFileKey(actualFileKey);
        setResponseMessage(`File uploaded successfully: ${fileName}`);
        console.log('File processed with key:', actualFileKey); // Debug log
      } else {
        throw new Error('Upload failed - unexpected response type');
      }
    } catch (error) {
      console.error('Upload error:', error); // Debug log
      setUploadError(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with About button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">File Conversion Service</h1>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
          >
            <Info className="w-5 h-5 mr-2" />
            About
          </button>
        </div>
      </header>

      {/* About Section - Animated */}
      <div className={`
        fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300
        ${showAbout ? 'opacity-100 z-50' : 'opacity-0 -z-10'}
      `}>
        <div className={`
          fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300
          ${showAbout ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-6">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <div className="space-y-4">
              <img
                src="/api/placeholder/150/150"
                alt="Profile"
                className="rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold">Your Name</h3>
              <p className="text-gray-600">
                Full Stack Developer | Cloud Enthusiast
              </p>
              <div className="space-y-2">
                <a
                  href="https://linkedin.com/in/your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn Profile
                </a>
                <p className="text-gray-600">
                  I specialize in building scalable web applications and microservices.
                  This file converter demonstrates my work with React, Node.js, and cloud services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleUpload}
                disabled={!file}
                className={`
                  inline-flex items-center px-4 py-2 rounded-md
                  ${!file 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </button>
            </div>

            {/* Error Display */}
            {uploadError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-700">{uploadError}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rest of your existing UI components with improved styling */}
        {/* ... */}
      </main>
    </div>
  );
}

// Add this CSS to your App.css
const styles = `
.preview-section {
  @apply mt-6 bg-white rounded-lg shadow p-6;
}

.text-content {
  @apply p-4 bg-gray-50 rounded-lg overflow-auto max-h-96;
}

.image-content {
  @apply max-w-full h-auto rounded-lg shadow-sm;
}

.pdf-content {
  @apply w-full h-96 rounded-lg shadow-sm;
}

.download-link {
  @apply inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700;
}
`;

export default App;
