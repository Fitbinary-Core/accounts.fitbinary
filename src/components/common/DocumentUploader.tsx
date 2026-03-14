"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  label: string;
  type: string;
  value?: {
    document_photo?: string;
    [key: string]: any;
  };
  onChange: (doc: any) => void;
  className?: string;
}

const DocumentUploader = ({
  label,
  type,
  value,
  onChange,
  className,
}: DocumentUploaderProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {value?.document_photo && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-white">
          <img
            src={value.document_photo}
            alt={`${label} Preview`}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        <input
          type="file"
          id={`doc-photo-${type}`}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                onChange({
                  ...value,
                  document_photo: reader.result as string,
                  _file: file,
                });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <label
          htmlFor={`doc-photo-${type}`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer text-sm font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          {value?.document_photo ? "Change File" : "Upload Document"}
        </label>
      </div>
    </div>
  );
};

export default DocumentUploader;
