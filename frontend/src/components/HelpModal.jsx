import React from "react";
import "./HelpModal.css"; // Create a CSS file for styling

function HelpModal({ isOpen, content, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay">
      <div className="help-modal">
        <button onClick={onClose}>Close</button>
        <div className="help-modal-content"
        dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

export default HelpModal;
