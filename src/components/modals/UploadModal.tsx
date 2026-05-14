"use client";

import React, { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface UploadModalProps {
  projectId: string;
  onClose: () => void;
}

export default function UploadModal({ projectId, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileError, setFileError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const queryClient = useQueryClient();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    if (bytes < k * k) return (bytes / k).toFixed(1) + ' KB';
    return (bytes / (k * k)).toFixed(2) + ' MB';
  };

  const resetSelection = () => {
    setUploadStatus('idle');
    setSelectedFile(null);
    setFileError(null);
    setErrorMessage("");
  };

  const handleFileSelection = (file: File) => {
    setFileError(null);
    const validTypes = [
      'text/csv',
      'application/json',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const validExtensions = ['.csv', '.xlsx', '.json'];

    const isMimeValid = validTypes.includes(file.type);
    const isExtensionValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isMimeValid && !isExtensionValid) {
      setFileError("Unsupported format. Please use CSV, Excel, or JSON datasets.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !projectId) return;
    setUploadStatus('uploading');

    try {
      const fileType = selectedFile.name.split('.').slice(-1)[0] || "unknown";

      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedFile.name,
          size: selectedFile.size,
          type: fileType,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Upload failed");
      }

      // Cache invalidation – sidebar file list update
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "files"] });
      setUploadStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message);
      setUploadStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl border border-surface-700/50 overflow-hidden">

        <div className="p-5 border-b border-surface-800 flex items-center justify-between bg-surface-900/50">
          <h3 className="text-lg font-bold text-surface-50">Upload Dataset</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-800 rounded-lg text-surface-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Success State */}
          {uploadStatus === 'success' ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <h4 className="text-lg font-bold text-surface-50">Upload Complete!</h4>
              <p className="text-sm text-surface-400">File is being processed by Clario.</p>
              <button onClick={onClose} className="w-full btn-genie py-3 mt-4">Done</button>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95">
              <AlertCircle size={32} className="mx-auto text-red-500" />
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-surface-50">Upload Failed</h4>
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
              <button onClick={resetSelection} className="w-full bg-surface-800 hover:bg-surface-700 text-surface-50 py-3 rounded-xl mt-4 transition-colors border border-surface-700">
                Try Again
              </button>
            </div>
          ) : (
            <>
              {fileError && (
                <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 font-medium">{fileError}</p>
                </div>
              )}

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive ? "border-brand-400 bg-brand-400/5" : "border-surface-700 bg-surface-900/50"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv, .xlsx, .json"
                  onChange={handleChange}
                  className="hidden"
                />

                <UploadCloud size={24} className={`mx-auto mb-4 ${dragActive ? 'text-brand-400' : 'text-surface-400'}`} />
                <h4 className="text-surface-100 font-bold mb-1">Drag & drop files</h4>
                <p className="text-xs text-surface-500 mb-4">CSV, Excel, or JSON (Max 50MB)</p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-4 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Browse Files
                </button>
              </div>

              {selectedFile && !fileError && (
                <div className="flex items-center justify-between p-3 bg-surface-800 rounded-lg border border-surface-700">
                  <div className="flex items-center gap-3 truncate">
                    <FileText size={18} className="text-brand-400 shrink-0" />
                    <span className="text-sm text-surface-200 truncate">{selectedFile.name}</span>
                  </div>
                  <span className="text-[10px] text-surface-500 font-mono">{formatFileSize(selectedFile.size)}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || !!fileError || uploadStatus === 'uploading'}
                className="w-full btn-genie py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing Dataset...
                  </>
                ) : (
                  "Upload to Project"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}