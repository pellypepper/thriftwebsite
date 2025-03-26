// Notification.js
import React, { useEffect } from 'react';
import './notify.css';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    // Automatically close the notification after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
