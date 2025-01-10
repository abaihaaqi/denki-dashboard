import { useCallback } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "../../utils/cn";

interface UploadProps {
  value?: File;
  onChange: (file: File | null) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  onError,
  className,
}: UploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        if (!file) return;
        onChange(file);
      } catch (error) {
        onError?.(
          error instanceof Error ? error.message : "Failed to upload file"
        );
      }
    },
    [onChange, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-500",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {value.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(value.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-red-600" />
            </button>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p>Drop the CSV file here...</p>
              ) : (
                <p>
                  Drag and drop a CSV file, or{" "}
                  <span className="text-indigo-600">browse</span>
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500">CSV files only (max. 10MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
