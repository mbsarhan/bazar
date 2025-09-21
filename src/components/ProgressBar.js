import React from 'react';
import '../styles/ProgressBar.css'; // سننشئ هذا الملف بعد قليل

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-filler" 
        style={{ width: `${progress}%` }} 
      />
      <span className="progress-bar-label">{Math.round(progress)}%</span>
    </div>
  );
};

export default ProgressBar;