"use client";

import { useEffect, useState } from "react";
import { X, Download, ExternalLink, ZoomIn, ZoomOut, RotateCw, ShieldCheck } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title?: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, title = "Document Preview" }: ImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset zoom & rotation when image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setIsLoading(true);
    }
  }, [isOpen, imageUrl]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = title.toLowerCase().replace(/\s+/g, "-") || "certification-document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card Window */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/90 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-100 truncate">{title}</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Verified Credential Document
              </p>
            </div>
          </div>

          {/* Action Tools & Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/50 mr-2">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title="Zoom Out"
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700/60 transition-colors"
              >
                <ZoomOut className="size-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-300 px-2 min-w-[40px] text-center select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                title="Zoom In"
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700/60 transition-colors"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 90°"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700/60 transition-colors border-l border-slate-700/50 ml-0.5"
              >
                <RotateCw className="size-4" />
              </button>
            </div>

            {/* External Link */}
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ExternalLink className="size-4" />
            </a>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              title="Download file"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Download className="size-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 rounded-lg border border-transparent transition-all"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Image Viewer */}
        <div className="relative flex-1 min-h-[300px] max-h-[calc(90vh-70px)] bg-slate-950/90 overflow-auto flex items-center justify-center p-4 sm:p-8 select-none">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 bg-slate-950/80 z-10">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs font-medium text-slate-400">Loading high quality document...</span>
            </div>
          )}

          <div
            className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
