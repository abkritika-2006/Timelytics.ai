import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface FileUploadZoneProps {
  title?: string;
  description?: string;
  acceptedTypes?: string[];
  onFileUpload?: (file: File) => Promise<void>;
  onFileSelect?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  loading?: boolean;
  progress?: number;
}

export function FileUploadZone({ 
  title = "Upload File", 
  description = "Select a file to upload", 
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  acceptedFileTypes,
  onFileUpload, 
  onFileSelect,
  maxFileSize,
  loading = false,
  progress = 0
}: FileUploadZoneProps) {
  // Use acceptedFileTypes if provided, otherwise use acceptedTypes
  const fileTypes = acceptedFileTypes || acceptedTypes || ['.csv', '.xlsx', '.xls'];
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileTypes.includes(`.${fileExtension}`)) {
      setUploadStatus('error');
      return;
    }

    // Check file size if maxFileSize is provided
    if (maxFileSize && file.size > maxFileSize) {
      setUploadStatus('error');
      return;
    }
    
    setSelectedFile(file);
    setUploadStatus('idle');
    
    // Call onFileSelect if provided (for immediate handling)
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !onFileUpload) return;
    
    setUploadStatus('uploading');
    try {
      await onFileUpload(selectedFile);
      setUploadStatus('success');
      setTimeout(() => {
        setSelectedFile(null);
        setUploadStatus('idle');
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : selectedFile
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={fileTypes.join(',')}
          onChange={handleFileSelect}
          disabled={loading}
        />

        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              dragActive ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Upload className={`h-8 w-8 ${
                dragActive ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h4 className="text-lg mb-2">{title}</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
              <p className="text-sm text-gray-500">
                Drag and drop your file here, or click to browse
              </p>
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {fileTypes.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFile}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploadStatus === 'uploading' && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500">Uploading... {progress}%</p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Upload successful!</span>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="flex items-center justify-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Upload failed. Please try again.</span>
              </div>
            )}

            {uploadStatus === 'idle' && onFileUpload && (
              <Button onClick={handleUpload} disabled={loading}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            )}
            
            {uploadStatus === 'idle' && !onFileUpload && onFileSelect && (
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">File selected successfully!</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}