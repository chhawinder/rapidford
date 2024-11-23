// AboutModal.js
import React from 'react';
import './AboutModal.css';

const AboutModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>About Me</h2>
        <p>Brief information about you goes here. You can describe your experience, skills, and interests.</p>
        <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
          <button className="linkedin-button">LinkedIn Profile</button>
        </a>
        <a href="/path/to/your/resume.pdf" download>
          <button className="download-resume-button">Download Resume</button>
        </a>
      </div>
    </div>
  );
};

export default AboutModal;