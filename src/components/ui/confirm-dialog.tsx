"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="presentation">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        role="presentation"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg bg-background border rounded-lg shadow-lg p-6",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-describedby="modal-description"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p id="modal-description" className="text-sm text-muted-foreground mt-2">
          {description}
        </p>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={cn(
            "flex-1 px-4 py-2 rounded-lg text-white transition",
            variant === "destructive"
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:opacity-90",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? "Loading..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}