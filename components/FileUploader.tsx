'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, CheckCircle, AlertCircle } from 'lucide-react';

export interface UploadedFileMeta {
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadedAt?: string;
}

interface FileUploaderProps {
  onFilesChanged: (files: UploadedFileMeta[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number; // default 50MB
  acceptedTypes?: string[];
  initialFiles?: UploadedFileMeta[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesChanged,
  maxFiles = 5,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB
  acceptedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  initialFiles = [],
}) => {
  const [files, setFiles] = useState<UploadedFileMeta[]>(initialFiles);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const newFileMetas: UploadedFileMeta[] = [...files];

    if (files.length + incomingFiles.length > maxFiles) {
      setErrorMessage(`You can upload a maximum of ${maxFiles} files per printing job.`);
      return;
    }

    // Simulate upload progress
    setUploadProgress(15);
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 90) {
          clearInterval(timer);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    Array.from(incomingFiles).forEach((file) => {
      // Validate file size
      if (file.size > maxSizeBytes) {
        setErrorMessage(`"${file.name}" exceeds the maximum limit of ${formatFileSize(maxSizeBytes)}.`);
        return;
      }

      // Validate file type
      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const prefix = type.split('/')[0];
          return file.type.startsWith(prefix);
        }
        return file.type === type || file.name.endsWith('.pdf') || file.name.endsWith('.docx');
      });

      if (!isAccepted && file.type) {
        setErrorMessage(`"${file.name}" has an unsupported format. Please upload PDF, JPG, PNG, WEBP, or DOCX.`);
        return;
      }

      const meta: UploadedFileMeta = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          meta.preview = e.target?.result as string;
          newFileMetas.push(meta);
          setFiles([...newFileMetas]);
          onFilesChanged([...newFileMetas]);
        };
        reader.readAsDataURL(file);
      } else {
        newFileMetas.push(meta);
        setFiles([...newFileMetas]);
        onFilesChanged([...newFileMetas]);
      }
    });

    setTimeout(() => {
      setUploadProgress(null);
    }, 600);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChanged(updated);
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-pink-500 bg-pink-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-pink-400 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-3 shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-800">
            <span className="text-pink-600 hover:underline">Click to upload</span> or drag and drop your print file
          </p>
          <p className="text-xs text-slate-500">
            Supports PDF (Preferred for sharp fonts), JPG, PNG, WEBP, DOCX (Max 50MB)
          </p>
          <p className="text-[11px] text-slate-400">
            Files are stored securely. You can also review proofs before final printing.
          </p>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Uploading & Verifying resolution...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-pink-600 h-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Ready for Printing ({files.length}/{maxFiles}):
          </div>
          <div className="grid gap-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                  ) : file.name.endsWith('.pdf') ? (
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      PDF
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}

                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">
                      {formatFileSize(file.size)} • Ready for print
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2 flex-shrink-0"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
