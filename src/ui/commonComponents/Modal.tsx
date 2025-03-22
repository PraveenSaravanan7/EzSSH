import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onCtaClick?: () => void;
  ctaText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onCtaClick,
  ctaText = "Confirm",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="secondary">
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onClose} className="secondary">
            Close
          </button>
          {onCtaClick && (
            <button onClick={onCtaClick} className="primary">
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
