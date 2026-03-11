import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface ImageUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  isMulti?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
}

const ImageUploader = ({
  value = [],
  onChange,
  isMulti = false,
  accept = "image/*",
  maxSize = 5,
  maxFiles = 5,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    newFiles.forEach((file) => {
      const isSizeValid = file.size / 1024 / 1024 <= maxSize;
      if (isSizeValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(
        `Some files were rejected because they exceed ${maxSize}MB limit.`,
      );
    }

    if (!isMulti) {
      if (validFiles.length > 0) {
        onChange([validFiles[0]]);
      }
    } else {
      const remainingSlots = maxFiles - value.length;
      if (remainingSlots <= 0) {
        toast.error(`You can only upload up to ${maxFiles} images.`);
        return;
      }

      const filesToAdd = validFiles.slice(0, remainingSlots);
      if (validFiles.length > remainingSlots) {
        toast.error(`Only ${remainingSlots} more images allowed.`);
      }

      onChange([...value, ...filesToAdd]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const onUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer bg-gray-50",
          isDragging
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-red-400",
          "min-h-50",
        )}
        onClick={onUploadClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={isMulti}
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Upload className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center">
          <p className="text-gray-900 font-medium text-lg">
            Click to upload or drag and drop
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {isMulti
              ? `SVG, PNG, JPG or GIF (max ${maxFiles} files, ${maxSize}MB each)`
              : `SVG, PNG, JPG or GIF (max ${maxSize}MB)`}
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((file, index) => (
            <div
              key={index + file.name}
              className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm"
            >
              <div className="aspect-square w-full relative">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Remove Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2 text-xs text-gray-600 truncate px-2 border-t border-gray-100">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
