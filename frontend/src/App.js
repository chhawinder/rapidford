import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import mammoth from 'mammoth';

function App() {
  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [fileKey, setFileKey] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState(null);
  const [password, setPassword] = useState("");
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [contentType, setContentType] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  // Refs for content containers
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const pdfContainerRef = useRef(null);

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (pdfDownloadUrl) URL.revokeObjectURL(pdfDownloadUrl);
    };
  }, [previewUrl, pdfDownloadUrl]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStreamContent('');
    setContentType(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      let response = await fetch('https://rapidford.onrender.com/upload/', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin':'*'
        },
        body: formData,
        mode: 'cors'
      });

      response = await response.json();
      console.log('Filedetails: ',response);
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

  // New streaming preview function
 const handleStreamPreview = async () => {
  if (!fileKey) {
    alert("No file uploaded to preview.");
    return;
  }

  try {
    setIsStreaming(true);
    setStreamContent('');
    setResponseMessage('');
    
    const response = await fetch(`https://rapidford-1.onrender.com/preview/${fileKey}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const contentType = response.headers.get('content-type');
    console.log('Received Content-Type:', contentType);
    setContentType(contentType);

    if (contentType.includes('text')) {
      // Handle text streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let textContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        textContent += text;
      }
      setStreamContent(textContent);  // Display complete text
    } else if (contentType.includes('image')) {
      // Handle image
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setPreviewUrl(imgUrl);
    } else if (contentType.includes('pdf')) {
      // Handle PDF
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setPreviewUrl(pdfUrl);
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Handle DOCX using mammoth.js
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      console.log('Received DOCX data, attempting to extract text...');
      mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then((result) => {
          console.log('Extracted text:', result.value);  // Log the text
          setStreamContent(result.value);  // Display the extracted text
        })
        .catch((err) => {
          console.error('Error extracting text:', err);
          setResponseMessage(`Error extracting text: ${err.message}`);
        });
    } else {
      setResponseMessage(`File type not supported for streaming preview. Content-Type: ${contentType}`);
    }
  } catch (error) {
    console.error('Error streaming file:', error);
    setResponseMessage(`Error streaming file: ${error.message}`);
  } finally {
    setIsStreaming(false);
  }
};


  const handleSimpleConvert = async () => {
    if (!fileKey) {
      alert("No file uploaded for conversion.");
      return;
    }

    try {
      const response = await fetch(`https://rapidford-4.onrender.com/convert/${fileKey}`, {
        method: 'GET',
      });

      if (response.ok) {
        const fileBlob = await response.blob();
        const downloadUrl = URL.createObjectURL(fileBlob);
        setPdfDownloadUrl(downloadUrl);
        setResponseMessage("File converted to PDF successfully.");
      } else {
        setResponseMessage(`Error converting file: ${response.statusText}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  const handleAuthConvertClick = () => {
    if (!fileKey) {
      alert("No file uploaded for conversion.");
      return;
    }
    setIsPasswordFormVisible(true);
  };

  const handleAuthConvertSubmit = async () => {
    if (!password) {
      alert("Please enter a password to apply to the PDF.");
      return;
    }

    try {
      const response = await fetch(`https://rapidford-5.onrender.com/convertAuth/${fileKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const fileBlob = await response.blob();
        const downloadUrl = URL.createObjectURL(fileBlob);
        setPdfDownloadUrl(downloadUrl);
        setResponseMessage("File converted to password-protected PDF successfully.");
      } else {
        setResponseMessage(`Error converting file: ${response.statusText}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>File Upload and Conversion Service</h1>

      {/* File input section */}
      <div className="section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file}>
          Upload File
        </button>
      </div>

      {/* Password input section */}
      {isPasswordFormVisible && (
        <div className="section">
          <label htmlFor="password">Enter Password (for Auth Convert):</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button onClick={handleAuthConvertSubmit}>Submit Password</button>
        </div>
      )}

      {/* Response message */}
      {responseMessage && <p className="message">{responseMessage}</p>}

      {/* Action buttons */}
      {fileKey && (
        <div className="section">
          <button onClick={handleStreamPreview} disabled={isStreaming}>
            {isStreaming ? 'Streaming...' : 'Stream Preview'}
          </button>
          <button onClick={handleSimpleConvert}>Convert to PDF</button>
          {!isPasswordFormVisible && (
            <button onClick={handleAuthConvertClick}>
              Convert to PDF with Password
            </button>
          )}
        </div>
      )}
{/* Content preview section */}
{(streamContent || previewUrl) && (
  <div className="preview-section">
    <h3>Preview</h3>

    {/* Text content */}
    {contentType?.includes('text') && streamContent && (
      <pre ref={textContainerRef} className="text-content">
        {streamContent}
      </pre>
    )}

    {/* Image content */}
    {contentType?.includes('image') && previewUrl && (
      <img
        ref={imageContainerRef}
        src={previewUrl}
        alt="Preview"
        className="image-content"
      />
    )}

    {/* PDF content */}
    {contentType?.includes('pdf') && previewUrl && (
      <iframe
        ref={pdfContainerRef}
        src={previewUrl}
        width="100%"
        height="600px"
        title="PDF Preview"
        className="pdf-content"
      />
    )}

    {/* DOCX Text Content */}
    {contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && streamContent && (
      <div className="docx-text-preview">
        <h4>DOCX Preview</h4>
        <pre>{streamContent}</pre>
      </div>
    )}
  </div>
)}


      {/* Download section */}
      {pdfDownloadUrl && (
        <div className="section">
          <h3>Download Converted PDF</h3>
          <a
            href={pdfDownloadUrl}
            download="converted-file.pdf"
            className="download-link"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
