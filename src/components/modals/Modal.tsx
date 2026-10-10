"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-card shadow-2xl w-full rounded-t-3xl rounded-b-none md:rounded-3xl md:w-[90vw] md:max-w-[530px]">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer z-10 w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
